/*
 * Breach: [front] update.js
 *
 * Copyright (c) 2014, Stanislas Polu. All rights reserved.
 *
 * @author: spolu
 *
 * @log:
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
        md5: '8f80c1125bb92b1f4bcbc2f65ab3bfea',
        version: 'v0.3-alpha.0',
        url: 'https://s3.amazonaws.com/breach_releases/breach/v0.3-alpha.0/breach-v0.3-alpha.0-osx-ia32.zip'
      },
      'x64': {
        md5: '8f80c1125bb92b1f4bcbc2f65ab3bfea',
        version: 'v0.3-alpha.0',
        url: 'https://s3.amazonaws.com/breach_releases/breach/v0.3-alpha.0/breach-v0.3-alpha.0-osx-ia32.zip'
      }
    },
    'linux': {
      'x64': {
        md5: '8607e20bb3b33e2b489c05b54feea792',
        version: 'v0.3-alpha.0',
        url: 'https://s3.amazonaws.com/breach_releases/breach/v0.3-alpha.0/breach-v0.3-alpha.0-linux-x64.tar.gz'
      }
    }
  };

  return res.json(update);
};
