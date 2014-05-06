var async = require('async');
var common = require('../lib/common.js');

common.PG_URL = process.env['BREACH_FRONT_PG_URL'] ||
  'postgres://dummy:dummy@localhost/breach_front';

console.log('PG_URL: ' + common.PG_URL);

common.pg = new (require('pg').Client)(common.PG_URL);

async.series([
  function(cb_) {
    common.pg.connect(cb_);
  },
  function(cb_) {
    common.pg.query('CREATE TABLE IF NOT EXISTS users(' +
                    '  user_id      SERIAL,' +
                    '  email        VARCHAR(128),' +
                    '  is_verified  BOOLEAN,' +
                    '  master       VARCHAR(40),' +
                    '  PRIMARY KEY(user_id),' +
                    '  UNIQUE(user_id),' +
                    '  UNIQUE(email)' +
                    ')', cb_);
  }
], function(err) {
  if(err) {
    common.fatal(err);
  }
  common.log.out('OK');
  process.exit(0);
});

