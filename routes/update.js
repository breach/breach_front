/*
 * Breach: [front] update.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
 * - 2014-05-27 spolu   Add signature file URLs
 * - 2014-05-15 spolu   Creation
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
// ### GET /update
//
exports.get_update = function(req, res, next) {
  var update = {
    'darwin': {
      'ia32': {
        version: '0.3.15-alpha.3',
        url: 'https://s3.amazonaws.com/breach_releases/breach/v0.3.15-alpha.3/breach-v0.3.15-alpha.3-darwin-ia32.tar.gz',
        signature: 'https://s3.amazonaws.com/breach_releases/breach/v0.3.15-alpha.3/breach-v0.3.15-alpha.3-darwin-ia32.tar.gz.sha1sum.asc'
      }
    },
    'linux': {
      'x64': {
        version: '0.3.20-alpha.5',
        url: 'https://raw.githubusercontent.com/breach/releases/master/v0.3.20-alpha.5/breach-v0.3.20-alpha.5-linux-x64.tar.gz',
        signature: 'https://raw.githubusercontent.com/breach/releases/master/v0.3.20-alpha.5/breach-v0.3.20-alpha.5-linux-x64.tar.gz.sha1sum.asc'
      }
    }
  };

  return res.json(update);
};
