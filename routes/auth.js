/*
 * Breach: [front] auth.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-05-04 spolu   Creation
 */
"use strict"

/******************************************************************************/
/* UTILITY METHODS */
/******************************************************************************/
// ### authenticate
//
// Checks the validity of the credentials (email, master) provided and retrieves 
// the user object.
// ```
// @email  {string} email
// @master {string} master 
// @cb_    {function(err, user)}
// ```
exports.authenticate = function(email, master) {
  if(typeof email !== 'string' ||
     typeof master !== 'string') {
    return cb_(common.err('auth_authenticate_error',
                          'Invalid Signup: Field Missing'));
  }

  var email_r = /^[a-z0-9._-+%]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if(!email_r.exec(email)) {
    return cb_(common.err('auth_authenticate_error',
                          'Invalid Email: ' + email));
  }

  var auth = {
    email: email,
    master: master
  };
  var user = null;

  async.series([
    function(cb_) {
       common.pg.query('SELECT * FROM users WHERE email=$1', 
                       [auth.email], function(err, rows) {
         if(err) {
           return cb_(err);
         }
         else if(rows.length === 0) {
           return cb_(common.err('auth_authenticate_error',
                                 'User not found: ' + auth.email));
         }
         else if(rows[0].master !== auth.master) {
           return cb_(factory.error('auth_authenticate_error',
                                    'Wrong password for: ' + auth.email));
         }
         else {
           user = rows[0];
           return cb_();
         }
       });
    }
  ], function(err) {
    return cb_(err, user);
  })
};

/******************************************************************************/
/* ROUTES */
/******************************************************************************/
//
// ### POST /auth/signup
//
exports.post_signup = function(req, res, next) {
  var user = null;

  async.series([
    function(cb_) {
      if(!req.body) {
        return cb_(factory.error('auth_signup_error',
                                 'Invalid Signup: No Body'));
      }
      if(typeof req.body.email !== 'string' ||
         typeof req.body.master !== 'string') {
        return cb_(common.err('auth_signup_error',
                              'Invalid Signup: Field Missing'));
      }
    
      var email_r = /^[a-z0-9._-+%]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if(!email_r.exec(req.body.email)) {
        return cb_(common.err('auth_signup_error',
                              'Invalid Email: ' + req.body.email));
      }
    
      user = {
        email: req.body.email,
        master: req.body.master,
        is_verified: false,
      }
      return cb_();
    },
    function(cb_) {
       common.pg.query('SELECT * FROM users WHERE email=$1', 
                       [user.email], function(err, rows) {
         if(err) {
           return cb_(err);
         }
         else if(rows.length > 0) {
           return cb_(common.err('auth_signup_error',
                                 'User already exists: ' + user.email));
         }
         return cb_();
       });
    },
    function(cb_) {
      common.pg.query('INSERT INTO users (email, master, is_verified) ' + 
                      'VALUES ($1, $2, $3)', 
                      [user.email, user.master, user.is_verified], 
                      function(err, data) {
        console.log(data);
        return cb_(err);
      });
    },
    function(cb_) {
      /*
      common.cio.identify(data.insertId.toString(),
                             user.email, {
                               is_verified: user.is_verified
                             }, cb_);
      */
      return cb_();
    },
    function(cb_) {
      /*
        common.cio.track(data.insertId.toString(), 'front:auth:signup', {}, cb_);
      */
      return cb_();
    }
  ], function(err) {
    if(err) {
      return next(err);
    }
    return res.json(user);
  });
};

//
// ### POST /auth/signin
//
exports.post_signin = function(req, res, next) {
  var user = null;

  async.series([
    function(cb_) {
      if(!req.body) {
        return cb_(factory.error('auth_signin_error',
                                 'Invalid Signin: No Body'));
      }
      return cb_();
    },
    function(cb_) {
      exports.authenticate(req.body.email, req.body.master, 
                           function(err, usr) {
        user = user;
        return cb_(err);
      });
    },
    function(cb_) {
      /*
        common.cio.track(user.user_id, 'front:auth:signin', {}, cb_);
      */
      return cb_();
    }
  ], function(err) {
    if(err) {
      return next(err);
    }
    return res.json(user);
  });
};

//
// ### POST /auth/verify/request
//
exports.post_verify_request = function(req, res, next) {
  var user = null;

  async.series([
    function(cb_) {
      if(!req.body) {
        return cb_(factory.error('auth_verify_error',
                                 'Invalid Signin: No Body'));
      }
      if(typeof req.body.redirect_url !== 'string') {
        return cb_(factory.error('auth_verify_error',
                                 'No Redirect URL: ' + req.body.redirect_url));
      }
    },
    function(cb_) {
      exports.authenticate(req.body.email, 
                           req.body.master, 
                           function(err, usr) {
        user = usr;
        return cb_(err);
      });
    },
    function(cb_) {
      var code = common.hash([
        user.email,
        common.SECRET
      ]);

      var verification_url = 
        'https://breach.cc/auth/verify/' + user.email + 
        '/' + code + '?' + 'redirect_url=' + escape(req.body.redirect_url);

      factory.log().out('VERIFY: ' + verification_url);

      common.cio.track(req.session.user_id.toString(), 
                       'front:auth:verify', {
                         verification_url: verification_url,
                         email: req.body.email
                       }, cb_);
    }
  ], function(err) {
    if(err) {
      return next(err);
    }
    return res.json({ok: true});
  });
};


//
// ### GET /auth/verify/:email/:code
//
exports.get_verify_code = function(req, res, next) {
  var user = null;

  async.series([
    function(cb_) {
      if(typeof req.param('redirect_url') !== 'string') {
        return cb_(factory.error('auth_verify_error', 
                                 'No Redirect URL: ' + 
                                 req.param('redirect_url')));
      }
      var email_r = /^[a-z0-9._-+%]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if(!email_r.exec(req.body.email)) {
        return cb_(common.err('auth_verify_error',
                              'Invalid Email: ' + req.body.email));
      }
      return cb_();
    },
    function(cb_) {
      var code = common.hash([
        req.body.email,
        common.SECRET
      ]);

      if(code !== req.param('code')) {
        return cb_(common.err('auth_verify_error',
                               'Invalid Code: ' + req.param('code')));
      }
      return cb_();
    },
    function(cb_) {
      common.pg.query('SELECT * FROM users WHERE email=$1',
                      [req.body.email], function(err, rows) {
         if(err) {
           return cb_(err);
         }
         else if(rows.length === 0) {
           return cb_(common.err('auth_verify_error',
                                 'User not found: ' + req.body.email));
         }
         else {
           user = rows[0];
           return cb_();
         }
      });
    },
    function(cb_) {
      common.pg.query('UPDATE users SET is_verified=1 WHERE email=$1',
                      [user.email], cb_);
    },
    function(cb_) {
      common.cio.identify(user.user_id.toString(), user.email, {
        is_verified: true
      }, cb_);
    },
    function(cb_) {
      if(!user.is_verified) {
        common.cio.track(user.user_id.toString(), 'auth:signup:verified', {}, 
                         cb_);
      }
      else {
        return cb_();
      }
    }
  ], function(err) {
    if(err) {
      return next(err);
    }
    else {
      return res.redirect(req.param('redirect_url'));
    }
  });
};
