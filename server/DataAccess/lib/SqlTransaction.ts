class SqlTransaction {
    connection;
    constructor(connection) {
      this.connection = connection;
      // this.connection.on('error', function (err) {
      //   console.log('db error', err);
      //   // if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      //   //   this.handleDisconnect();                         // lost due to either server restart, or a
      //   // } else {                                      // connnection idle timeout (the wait_timeout
      //   //   throw err;                                  // server variable configures this)
      //   // }
      // });
    }
  
    handleDisconnect() {
      // this.connection = mysql.createConnection(db_config);
      // return
    }
  
    query(query, params, callback) { // command
      // this.connection.beginTransaction((err) => {
      // console.log(query, params);
      try {
        if (this.connection) {
          this.connection.query(query, params, (error, result) => {
            if (error) {
              this.connection.rollback();
              console.log(error);
              // const mysql2_condition = this.connection._pool && this.connection._pool !== null && this.connection._pool._freeConnections &&
              //   this.connection._pool._freeConnections !== null && this.connection._pool._freeConnections._list &&
              //   this.connection._pool._freeConnections._list !== null &&
              //   this.connection._pool._freeConnections._list.indexOf(this.connection) === -1;
  
              if (this.connection._pool && this.connection._pool !== null && this.connection._pool._freeConnections.indexOf(this.connection) === -1) {
                this.connection.release();
                // console.log('connection released');
              }
              return callback(null, error);
            }
            // console.log(result);
            return callback(result, null);
          });
        } else {
          return callback(null, 'Database unavailable');
        }
      } catch (err) {
        console.log(err);
        return callback(null, 'The database is unavailable, please try again');
      }
      // });
    }
  
    complete() {
  
      this.connection.commit((err) => {
        if (err) {
  
          console.log(err);
          return err;
        }
        if (this.connection._pool && this.connection._pool !== null && this.connection._pool._freeConnections.indexOf(this.connection) === -1) {
          this.connection.release();
          // console.log('connection released');
        }
      });
    }
  
  }
  
  module.exports = SqlTransaction;
  