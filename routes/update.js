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
        md5: '7195ae3dd47dfac19b6e1e3ca39388d4',
        version: '0.3.5-alpha.1',
        url: 'https://s3.amazonaws.com/breach_releases/breach/v0.3.5-alpha.1/breach-v0.3.5-alpha.1-darwin-ia32.tar.gz'
      }
    },
    'linux': {
      'x64': {
        md5: '9719fe450db47edc97b0382c1095c82f',
        version: '0.3.5-alpha.1',
        url: 'https://s3.amazonaws.com/breach_releases/breach/v0.3.5-alpha.1/breach-v0.3.5-alpha.1-linux-x64.tar.gz'
      }
    }
  };

  return res.json(update);
};
