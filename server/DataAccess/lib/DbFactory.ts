// const proxyMysqlDeadlockRetries = require('node-mysql-deadlock-retries');
// var retries: 5;      	// How many times will the query be retried when the ER_LOCK_DEADLOCK error occurs
// var minMillis: 1;    	// The minimum amount of milliseconds that the system sleeps before retrying
// var maxMillis: 10000;  	// The maximum amount of milliseconds that the system sleeps before retrying
// var debug = 1;		 	// Show all the debugs on how the proxy is working
// var show_all_errors = 1;// Show all errors that are outside of the proxy

const _dbConnection = require('./Connection');
/**
 * Factory abstraction for creating database connection
 */
class DbFactory {
  static create(account, callback = null) {
    if (arguments.length === 1) {
      callback = account;
      account = 'demoaccount';
    }
    let st;
    const sqltranscation = require('./SqlTransaction');
    _dbConnection.getConnection(account, (err, connection) => {
      if (err) {
        console.log('ERROR: getConnection failed: err = ' + err);
      }
      // proxyMysqlDeadlockRetries(connection, retries, minMillis, maxMillis, debug, show_all_errors);
      st = new sqltranscation(connection);
      return callback(st);
    });
  }

  // adf2-427a-8aa6

  static createnotrx(account, callback = null) {
    try {
      if (arguments.length === 1) {
        callback = account;
        account = 'demoaccount';
      }
      let cn;
      _dbConnection.getConnection(account, (err, connection) => {
        if (err) {
          console.log('ERROR: getConnection failed: err = ' + err);
        }
        // proxyMysqlDeadlockRetries(connection, retries, minMillis, maxMillis, debug, show_all_errors);
        // connection.on('error', function (err) {
        //   console.log('Notrxn error', err);
        // });
        cn = connection;
        return callback(cn);
      });
    } catch (err) {
      console.log(err);
    }
  }

}
export const databaseFactory = DbFactory;
