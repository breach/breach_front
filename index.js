#!/usr/bin/env node
/*
 * Breach: [front] index.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-05-02 spolu   Creation
 */
"use strict"

var express = require('express');
var util = require('util');
var fs = require('fs');
var http = require('http');

var app = express();

var setup = function() {
  /* App Configuration */
  app.use('/', express.static(__dirname + '/app'));
  app.use(require('body-parser')());
  app.use(require('method-override')())

  app.use(function(err, req, res, next) {
    common.log.error(err);
    return res.send(500, { 
      error: {
        name: err.name,
        message: err.message 
      }
    });
  });

  //
  // ### _JSON ROUTES_
  //

  app.post('/auth/signup',            require('./routes/auth.js').post_signup);
  app.get( '/auth/signin',            require('./routes/auth.js').post_signin);
};

// INIT & START
common.log.out('breach_front [Started]');

/* Setup */
setup();

common.PORT = process.env['TEABAG_TABLE_PORT'] ?
  parseInt(process.env['TEABAG_TABLE_PORT'], 10) : 0;

var http_srv = http.createServer(my.app).listen(common.PORT);
http_srv.on('listening', function() {
  var port = http_srv.address().port;
  common.log.out('HTTP Server started on port: ' + common.PORT);
});

// SAFETY NET (kills the process and the spawns)
process.on('uncaughtException', function (err) {
  common.fatal(err);
});

