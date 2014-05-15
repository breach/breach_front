#!/usr/bin/env node
/*
 * Breach: [front] index.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-05-15 spolu   Update route
 * - 2014-05-02 spolu   Creation
 */
"use strict"

var express = require('express');
var util = require('util');
var fs = require('fs');
var http = require('http');

var common = require('./lib/common.js');

var app = express();

var setup = function() {
  //
  // ### _JSON ROUTES_
  //
  app.get( '/auth/join',                require('./routes/auth.js').get_join);

  app.get( '/update',                   require('./routes/update.js').get_update);
};


// INIT & START
common.log.out('Breach: front [Started]');

common.PG_URL = process.env['BREACH_FRONT_PG_URL'] ||
  'postgres://dummy:dummy@localhost/breach_front';
common.log.out('PG_URL: ' + common.PG_URL);

common.PORT = process.env['BREACH_FRONT_PORT'] ?
  parseInt(process.env['BREACH_FRONT_PORT'], 10) : 0;
common.log.out('PORT: ' + common.PORT);

common.SECRET = process.env['BREACH_FRONT_SECRET'] || 'dummy';
common.log.out('SECRET: ' + common.SECRET);

common.CIO_SITE_ID = process.env['BREACH_CIO_SITE_ID'] || 'dummy';
common.log.out('CIO_SITE_ID: ' + common.CIO_SITE_ID);
common.CIO_SECRET_KEY = process.env['BREACH_CIO_SECRET_KEY'] || 'dummy';
common.log.out('CIO_SECRET_KEY: ' + common.CIO_SECRET_KEY);

common.pg = new (require('pg').Client)(common.PG_URL);
common.pg.connect(function(err) {
  if(err) {
    console.log('HERE');
    return common.fatal(err);
  }

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

  /* Setup */
  setup();

  var http_srv = http.createServer(app).listen(common.PORT);
  http_srv.on('listening', function() {
    var port = http_srv.address().port;
    common.log.out('HTTP Server started on port: ' + common.PORT);
  });

  common.cio = new (require('node-customer.io'))(
    common.CIO_SITE_ID,
    common.CIO_SECRET_KEY
  );
});

// SAFETY NET (kills the process and the spawns)
process.on('uncaughtException', function (err) {
  common.fatal(err);
});

