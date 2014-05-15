/*
 * Breach: [front] auth.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-05-06 spolu   Added `join` route
 * - 2014-05-04 spolu   Creation
 */
"use strict"

var async = require('async');
var common = require('../lib/common.js');

/******************************************************************************/
/* UTILITY METHODS */
/******************************************************************************/

/******************************************************************************/
/* ROUTES */
/******************************************************************************/
//
// ### GET /auth/join
//
exports.get_join = function(req, res, next) {
  var user = null;
  var exist = false;

  async.series([
    function(cb_) {
      var email = req.param('email').toLowerCase();
      var email_r = /^[a-z0-9\.\_\-\+\%]+@[a-z0-9\.\-]+\.[a-z]{2,}$/;
      if(!email_r.exec(email)) {
        return cb_(common.err('auth_signup_error',
                              'Invalid Email: ' + email));
      }
    
      user = {
        email: email,
        is_verified: false,
      }
      return cb_();
    },
    function(cb_) {
       common.pg.query('SELECT * FROM users WHERE email=$1', 
                       [user.email], function(err, data) {
         if(err) {
           return cb_(err);
         }
         else if(data.rows.length > 0) {
           user.user_id = data.rows[0].user_id;
           exist = true;
         }
         else {
           exist = false;
         }
         return cb_();
       });
    },
    function(cb_) {
      if(!exist) {
        common.pg.query('INSERT INTO users (email, is_verified) ' + 
                        'VALUES ($1, $2) RETURNING user_id', 
                        [user.email, user.is_verified], 
                        function(err, data) {
          if(err) {
            return cb_(err);
          }
          user.user_id = data.rows[0].user_id;
          return cb_();
        });
      }
      else {
        return cb_();
      }
    },
    function(cb_) {
      common.cio.identify(user.user_id.toString(),
                          user.email, {
                            is_verified: user.is_verified,
                            created_at: Math.floor(Date.now() / 1000)
                          }, cb_);
    },
    function(cb_) {
      if(!exist) {
        common.cio.track(user.user_id.toString(), 'front:auth:signup', {}, cb_);
      }
      else {
        return cb_();
      }
    }
  ], function(err) {
    if(err) {
      return next(err);
    }
    if(req.param('callback')) {
      return res.jsonp(user);
    }
    else {
      return res.json(user);
    }
  });
};

