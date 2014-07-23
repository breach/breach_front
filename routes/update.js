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
        version: '0.3.22-alpha.6',
        url: 'https://raw.githubusercontent.com/breach/releases/master/v0.3.22-alpha.6/breach-v0.3.22-alpha.6-darwin-ia32.tar.gz',
        signature: 'https://raw.githubusercontent.com/breach/releases/master/v0.3.22-alpha.6/breach-v0.3.22-alpha.6-darwin-ia32.tar.gz.sha1sum.asc'
      }
    },
    'linux': {
      'x64': {
        version: '0.3.22-alpha.6',
        url: 'https://raw.githubusercontent.com/breach/releases/master/v0.3.22-alpha.6/breach-v0.3.22-alpha.6-linux-x64.tar.gz',
        signature: 'https://raw.githubusercontent.com/breach/releases/master/v0.3.22-alpha.6/breach-v0.3.22-alpha.6-linux-x64.tar.gz.sha1sum.asc'
      }
    }
  };

  return res.json(update);
};
