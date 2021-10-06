const mysql = require('mysql');
const config = require('../../dbConfig/dbconfig');
// const pwconfig = require('../../Controllers/jwtConfig/jwtConfig');
import { cipher } from '../../Entities/Common/cryptography';

const authpool = mysql.createPool({
  host: config.connection.host,
  user: config.connection.user,
  password: config.connection.password,
  database: config.connection.database
});

const dbconfigs = [];
const dynconnectionpools = [];

authpool.getConnection((err, connection) => {

    connection.query('SELECT * FROM accounts', [], (error, result) => {
      if (error) {
        return null;
      }
      result.forEach(dbc => {
        
        // const pw = cipher.decrypt(dbc.password); 
        const pw = dbc.password; //remove this
        
        const temp: any = {};
        temp['dbdetail'] = {};
        temp.dbdetail.client = dbc.client;
        temp.dbdetail.connection = {};
        temp.dbdetail.connection.host = dbc.host;
        temp.dbdetail.connection.user = dbc.user;
        temp.dbdetail.connection.password = pw;
        temp.dbdetail.connection.database = dbc.database;
        temp.dbdetail.connection.host = dbc.host;
        temp.islazyload = dbc.islazyload;
        temp.account = dbc.account;
        dbconfigs.push(temp);
      });
  
      dbconfigs.forEach(dbc => {
        if (!(dbc.islazyload)) {
          dynconnectionpools.push({
            key: dbc.account,
            connectionpool: () => {
              const dbconfig = dbc.dbdetail.connection;
              if (dbc.dbdetail.client === 'mysql') {
                const cp = mysql.createPool({
                  host: dbconfig.host,
                  user: dbconfig.user,
                  password: dbconfig.password,
                  database: dbconfig.database,
                  connectionLimit: 1000,
                  acquireTimeout: 1000000,
                  waitForConnections: true,
                  connectTimeout: 1000000
                });
                return cp;
              }
              return null;
            }
          });
        }
      });

    });
  });

const createNewConnectionPool = function (dbdetail) {
  const dbconfig = dbdetail.connection;
  if (dbdetail.client === 'mysql') {
    const cp = mysql.createPool({
      host: dbconfig.host,
      user: dbconfig.user,
      password: dbconfig.password,
      database: dbconfig.database,
      connectionLimit: 1000
    });
    cp.on('release', function (connection) {
      // console.log('Connection %d released', connection.threadId);
    });

    return cp;
  }
  return null;
};

exports.getConnection = function (account = 'demoaccount', callback) {
  let cp;

  // get the connection pool from the array for the key == dbname
  const dynconpool = dynconnectionpools.find(i => i.key === account);

  if (dynconpool) {
    
    // if connection pool exists, use it
    cp = dynconpool.connectionpool;
  } else {

    // LAZY LOADING!!!

    // if connection pool does not exist, then find the configuration from dbconfigjson
    const dbcfgjson = dbconfigs.find(j => j.account === account);

    // create a new connection pool and add it to pool array and use it
    cp = createNewConnectionPool(dbcfgjson.dbdetail);

    dynconnectionpools.push({
      key: account,
      connectionpool: cp
    });
  }
  cp.getConnection(callback);
};

// let connectionpool = mysql.createPool({
//   host: config.connection.host,
//   user: config.connection.user,
//   password: config.connection.password,
//   database: config.connection.database,
//   connectionLimit: 1000,
//   connectTimeout: 60 * 60 * 1000,
//   aquireTimeout: 60 * 60 * 1000,
//   multipleStatements: true,
//   timeout: 60 * 60 * 1000,
// });

// exports.getConnection = function (callback) {
//   console.log(config);
// connectionpool.getConnection(callback);
// };
