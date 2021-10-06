// import needed modules
import { Router, Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
// import * as speakeasy from 'speakeasy';
// import * as QRCode from 'qrcode';
import * as bcryptjs from 'bcryptjs';
import * as jsonwebtoken from 'jsonwebtoken';
// import * as multer from 'multer';
import * as moment from 'moment';
// import * as fs from 'fs';
const config = require('../jwtConfig/jwtConfig');

// import * as crypto from 'crypto';
import { isArray } from 'util';
// import needed classes
import { databaseFactory } from '../../DataAccess/lib/DbFactory';
import { loginDAL } from '../../DataAccess/Login';
import { cipher } from '../../Entities/Common/cryptography';
// import * as strategy from '../auth/auth'

const passportJWT = require('passport-jwt');
const passport = require('passport');
const crypto = require('crypto');

// import { getTableParams } from '../../Entities/Common/table';
// import { billDal } from '../../DataAccess/Bills';
// import { request } from 'http';
// import * as rw from 'rw';


import { auditDAL } from '../../DataAccess/Audits';

// instantiate router instance
const router: Router = Router();

// options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization', 'Authorizations'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false
};

const jwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken();

jwtOptions['secretOrKey'] = config.jwt_secret;
const strategy = new jwtStrategy(jwtOptions, function (jwtPayload, next) {
  // console.log('payload received', jwt_payload);
  // usually this would be a database call:

  // var user = users.filter( user => user.id == jwt_payload.id)[0];
  databaseFactory.createnotrx((st, err) => {
    if (err) {
      // return res.status(500).json({
      //   title: 'Database error: ' + err.message ? err.message : err
      // });
    }

    const data = new loginDAL(st);
    const token = jwtPayload;
    // payload;
    // @ts-ignore
    const payload = cipher.decrypt(token.payload);
    const obj = JSON.parse(payload);
    const id = obj.id;

    data.getUser(id, (user: any, error) => {
      if (error) { } else {
        if (user) {
          next(null, user);
        } else {
          next(null, false);
        }
      }
      st.release();
    });
  });
});

// use cors middleware
router.use(cors(options));

const userCache = {};

passport.serializeUser(function (user, next) {
  const id = user[0].id;
  userCache[id] = user;
  next(null, id);
});

passport.deserializeUser(function (id, next) {
  next(null, userCache[id]);
});
passport.use(strategy);
router.use(passport.initialize());

let secretToken = '';

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, 'uploads/');
//   },
//   filename: function (req, file, callback) {
//     const splitFileName = file.originalname.split('.');
//     const fileExt = '.' + splitFileName[splitFileName.length - 1];
//     callback(null, Date.now() + fileExt);
//   }
// });

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('api works!');
});

/**
 * api for login with username and password
 */
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(0, null);
  if (req.body && req.body.email && req.body.password) {
    const email = req.body.email;
    const password = req.body.password;
    // @ts-ignore

    databaseFactory.create((st, err) => {
      if (err) {
        return res.status(500).json({
          title: 'Database error: ' + err.message ? err.message : err
        });
      }
      const login = new loginDAL(st);
      login.getAuth(email, (data: any, error) => {
        if (error) {
          return res.status(500).json({
            title: 'Database error: ' + error.message
          });
        }
        if (!data || data.length === 0) {
          res.status(401).json({
            title: 'Invalid login credentials'
          });
        } else {
          const timeStamp = data[0].timeStamp;
          const userData = data[0];
          // console.log(userData);
          if (isArray(userData)) {
            res.status(500).json({
              title: 'Multiple users found with same username'
            });
          }
        //   if (bcryptjs.compareSync(password, userData.password)) {
          if (password == userData.password) { //remove this

//            // console.log('crypto',crypto.randomBytes(256).toString('hex'));
//            // var currentDate = moment().utc().format("MM-DD-YYYY HH:mm:ss");
            let payload = JSON.stringify({ id: data[0].id, random: crypto.randomBytes(256).toString('hex'), timestamp: timeStamp.toString() });
//            // const encrypt = crypto.createCipher('aes-128-cbc', 'd03a4db043');
            payload = cipher.encrypt(payload);
            const token = jsonwebtoken.sign({ 'payload': payload }, config.jwt_secret, { expiresIn: 86400 });
//            // const secret = speakeasy.generateSecret({ length: 20 });

            // const audit = new auditDAL(st); //used for audit
            // audit.getPreComputeStatusnotrx((status, auditErr) => { //used for audit
              // if (status) { //used for audit
              if(1){
                res.status(200).json({
                  msg: 'Logged In',
                  token: token,
                  // email: email,
                  twoFAString: userData.two_fa_secret_string,
                  twoFAEnabled: userData.is_2fa_enabled,
                  // firstName: userData.given_names,
                  // lastName: userData.last_name
                });
              } else {
                res.status(500).json({
                  title: 'Multiple users found with same username'
                });
              }
            // }); //used for audit


          } else {
            res.status(401).json({
              title: 'Some Error Occured'
            });
          }
        }
      });
      st.complete();
    });

  } else {
    res.status(401).json({
      title: 'fields missing'
    });
  }
});

// router.post('/verify', function (req, res, next) {
//   req.setTimeout(0, null);
//   // console.log(req.body.twoFAString);
//   // console.log(req.body.key);
//   const verified = speakeasy.totp.verify({
//     secret: req.body.twoFAString,
//     encoding: 'base32',
//     token: req.body.key
//   });
//   if (!verified) {
//     res.status(401).json({
//       title: 'Some Error Occured'
//     });
//   } else {
//     return res.status(200).json({
//       data: verified
//     });
//   }

// });


/**
 * token verfification
 */
router.get('/verifyToken', passport.authenticate('jwt', { session: true }), function (req, res, next) {
  try {
    req.setTimeout(0, null);
    if (req.headers.authorization) {
      const token = req.headers.authorization.toString().split(' ');
      jsonwebtoken.verify(token[1], config.jwt_secret, function (err, decoded) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            title: 'Token not matched' + err.message ? err.message : err
          });
        }
        // @ts-ignore
        const payload = cipher.decrypt(decoded.payload);
        const obj = JSON.parse(payload);
        const id = obj.id;
        const timestamp = obj.timestamp;

        databaseFactory.create((st, dbErr) => {
          if (dbErr) {
            console.log(dbErr);
            return res.status(500).json({
              title: 'Database error: ' + dbErr.message ? dbErr.message : dbErr
            });
          }

          //  // **** use this for user updation (remove)

          // const logindata = new loginDAL(st);
          // logindata.getVerificationDetails(id, (data: any, error) => {
            // if (error) {
              // console.log(error);
              // return res.status(500).json({
                // title: 'Database error: ' + error.message ? error.message : error
              // });
            // }
            // if (data) {
              // const updatedTimestamp = Date.parse(moment(data[0].updated_TIMESTAMP).format('MM-DD-YYYY HH:mm:ss'));
              // const tokenTimestamp = Date.parse(moment(timestamp).format('MM-DD-YYYY HH:mm:ss'));
              // if (tokenTimestamp >= updatedTimestamp) {
                return res.status(200).json({
                  title: 'token verified'
                });
              // } else {
                // return res.status(401).json({
                  // title: 'Invalid login credentials'
                // });
              // } // **** use this for user updation (remove)
            // } else {
              // return res.status(401).json({
                // title: 'No data'
              // });
            // }
          // });
          // st.complete();


        });
      });
    }
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      title: 'Database error: ' + e
    });
  }
});


//  * Check for tokens and other params
router.use('/', function (req, res, next) {

  req.setTimeout(0, null);
  if (req.headers.authorization) {
    const token = req.headers.authorization.toString().split(' ');

    jsonwebtoken.verify(token[1], config.jwt_secret, function (err, decoded) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          title: 'Token not matched' + err.message ? err.message : err
        });
      }
      // @ts-ignore
      const payload = cipher.decrypt(decoded.payload);
      const obj = JSON.parse(payload);
      const id = obj.id;
      const timestamp = obj.timestamp;

      databaseFactory.create((st, dbErr) => {
        if (dbErr) {
          console.log(dbErr);
          return res.status(500).json({
            title: 'Database error: ' + dbErr.message ? dbErr.message : dbErr
          });
        }

        const logindata = new loginDAL(st);

        logindata.getVerificationDetails(id, (data: any, error) => {
          if (error) {
            console.log(error);
            return res.status(500).json({
              title: 'Database error: ' + error.message ? error.message : error
            });
          }
          if (data) {
            const updatedTimestamp = Date.parse(moment(data[0].updated_TIMESTAMP).format('MM-DD-YYYY HH:mm:ss'));
            const tokenTimestamp = Date.parse(moment(timestamp).format('MM-DD-YYYY HH:mm:ss'));
            if (tokenTimestamp >= updatedTimestamp) {
              // return res.status(200).json({
              //   title: 'token verified'
              // });
              next();
            } else {
              return res.status(401).json({
                title: 'Invalid token'
              });
            }
          } else {
            return res.status(401).json({
              title: 'No data'
            });
          }
        });
        st.complete();
      });
    });
  } else {
    next();
  }

});

router.post('/changePassword', passport.authenticate('jwt', { session: true }), function (req, res, next) {
  req.setTimeout(0, null);

  const currentPassword = req.body.currentPassword;
  const password = req.body.newPassword;

  const jwtToken = req.headers.authorization.toString().split(' ');
  // payload;
  jsonwebtoken.verify(jwtToken[1], config.jwt_secret, function (err, decoded) {
    // @ts-ignore
    const jwtPayload = cipher.decrypt(decoded.payload);
    const obj = JSON.parse(jwtPayload);
    const userId = obj.id;

    databaseFactory.create((st, dbErr) => {
      if (dbErr) {
        return res.status(500).json({
          title: 'Database error: ' + dbErr.message ? dbErr.message : dbErr
        });
      }
      const logindata = new loginDAL(st);

      logindata.getUserDetails(userId, (userDetails: any, userErr) => {
        if (userErr) {
          return res.status(500).json({
            title: 'Database error: ' + userErr.message
          });
        } else {
          logindata.getAuth(userDetails[0].email, (data: any, error) => {
            if (error) {
              return res.status(500).json({
                title: 'Database error: ' + error.message
              });
            }
            if (!data || data.length === 0) {
              res.status(401).json({
                title: 'Invalid login credentials'
              });
            } else {

              const userData = data[0];
              const id = userData.id;
              // console.log(userData);

              if (isArray(userData)) {
                res.status(500).json({
                  title: 'Multiple users found with same username'
                });
              }
              if (bcryptjs.compareSync(currentPassword, userData.password)) {
                const changepasswordDal = new loginDAL(st);

                const salt = bcryptjs.genSaltSync(10);
                const hash = bcryptjs.hashSync(password, salt);

                changepasswordDal.changePassword(id, hash, (time: any, cPError) => {

                  if (cPError) {
                    return res.status(401).json({
                      title: 'can\'t change password'
                    });
                  } else {

                    // console.log('crypto',crypto.randomBytes(256).toString('hex'));
                    // var currentDate = moment().utc().format("MM-DD-YYYY HH:mm:ss");
                    // console.log(id);
                    let payload = JSON.stringify({ id: id, random: crypto.randomBytes(256).toString('hex'), timestamp: time.toString() });
                    // const encrypt = crypto.createCipher('aes-128-cbc', 'd03a4db043');
                    payload = cipher.encrypt(payload);
                    const token = jsonwebtoken.sign({ 'payload': payload }, config.jwt_secret, { expiresIn: 86400 });
                    // const secret = speakeasy.generateSecret({ length: 20 });

                    res.status(200).json({
                      msg: 'Logged In',
                      token: token,
                      // email: email,
                      twoFAString: userData.two_fa_secret_string,
                      twoFAEnabled: userData.is_2fa_enabled,
                      // firstName: userData.given_names,
                      // lastName: userData.last_name
                    });
                  }
                  st.complete();
                });

              } else {
                res.status(401).json({
                  title: 'can\'t change password'
                });
              }
            }
          });
        }
      });
    });
  });
});


router.post('/getUserDetails', passport.authenticate('jwt', { session: true }), function (req, res, next) {
  req.setTimeout(0, null);
  const token = req.headers.authorization.toString().split(' ');

  jsonwebtoken.verify(token[1], config.jwt_secret, function (err, decoded) {

    // @ts-ignore
    const payload = cipher.decrypt(decoded.payload);
    const obj = JSON.parse(payload);
    const id = obj.id;

    databaseFactory.create((st, dbErr) => {
      if (dbErr) {
        return res.status(500).json({
          title: 'Database error: ' + dbErr.message ? dbErr.message : dbErr
        });
      }
      const login = new loginDAL(st);
      login.getUserDetails(id, (result, error) => {
        if (error) {
          return res.status(500).json({
            title: 'Database error: ' + error.message
          });
        } else {
          st.complete();
          return res.status(200).json({
            firstName: result[0].given_names,
            lastName: result[0].last_name,
            description: result[0].description
          });
        }
      });
    });
  });
});

/**
 * Check for tokens and other params
 */
// router.use('/', function (req, res, next) {
//   const token = req.headers.authorization;
//   // @ts-ignore
//   jsonwebtoken.verify(token, config.jwt_secret, function (err, decoded) {
//     if (err) {
//       return res.status(401).json({
//         title: 'Not Authenticated',
//         error: err
//       });
//     }
//     // const encrypt = crypto.createDecipher('aes-128-cbc', 'd03a4db043');
//     // token = encrypt.update(token, 'hex', 'utf8')
//     next();
//   });
// });



/**
 * api for 2fa enabling
 */


// router.post('/enable2fa', passport.authenticate('jwt', { session: true }), function (req, res, next) {
//   req.setTimeout(0, null);
//   try {
//     // console.log(req.body);
//     databaseFactory.createnotrx((st, err) => {
//       if (err) {
//         return res.status(500).json({
//           title: 'Database error: ' + err.message ? err.message : err
//         });
//       }

//       const userToken = req.headers.authorization.toString();
//       const token = userToken.split(' ');
//       // payload;
//       jsonwebtoken.verify(token[1], config.jwt_secret, function (jwtErr, decoded) {
//         // @ts-ignore
//         const payload = cipher.decrypt(decoded.payload);
//         const obj = JSON.parse(payload);
//         const id = obj.id;

//         const logindata = new loginDAL(st);
//         const contact = new contactDAL(st);

//         logindata.getUserDetails(id, (userError, data: any) => {

//           if (userError) {
//             return res.status(500).json({
//               title: 'Database error: ' + userError.message
//             });
//           } else {
//             contact.getNameByEmail(data[0].email, (contacts, error) => {
//               if (error) {
//                 return res.status(500).json({
//                   title: 'Database error: ' + error.message
//                 });
//               }
//               if (contacts.length === 0) {
//                 res.status(500).json({
//                   title: 'User not found'
//                 });
//               } else {
//                 const secret = speakeasy.generateSecret({ length: 20, name: 'TMaaS(' + contacts[0].full_name + ')' });
//                 secretToken = secret.base32;
//                 const login = new loginDAL(st);
//                 login.getAuth(data[0].email, (authErr, userData: any) => {
//                   if (authErr) {
//                     res.status(500).json({
//                       title: 'Database error: ' + authErr.message
//                     });
//                   }
//                   QRCode.toDataURL(secret.otpauth_url, function (qrErr, dataUrl) {
//                     // console.log(dataUrl);
//                     res.status(200).json({
//                       msg: 'Success',
//                       data: {
//                         url: dataUrl,
//                         code: secretToken
//                       }
//                     });
//                   });
//                 });
//               }
//               st.release();
//             });
//           }
//         });

//       });
//     });
//   } catch (err) {
//     res.status(500).json({
//       err: err.message
//     });
//   }
// });

/**
 * api for 2fa enabling
 */
router.post('/activate2fa', passport.authenticate('jwt', { session: true }), function (req, res, next) {
  try {

    req.setTimeout(0, null);
    // const email = req.body.mail;
    const token = req.headers.authorization.toString().split(' ');
    const code = req.body.code;


    jsonwebtoken.verify(token[1], config.jwt_secret, function (err, decoded) {
      // @ts-ignore
      const tokenPayload = cipher.decrypt(decoded.payload);
      const obj = JSON.parse(tokenPayload);
      const id = obj.id;

      databaseFactory.create((st, dbErr) => {
        if (dbErr) {
          return res.status(500).json({
            title: 'Database error: ' + dbErr.message ? dbErr.message : dbErr
          });
        }
        const login = new loginDAL(st);
        login.update2FA(id, true, code, (result, error) => {
          if (error) {
            return res.status(500).json({
              title: 'Database error: ' + error.message
            });
          } else {
            login.getUserDetails(id, (data: any, totalErr) => {
              if (totalErr) {
                return res.status(500).json({
                  title: 'Database error: ' + totalErr.message
                });
              } else {
                const timeStamp = data[0].timeStamp;
                // console.log('crypto',crypto.randomBytes(256).toString('hex'));
                // var currentDate = moment().utc().format("MM-DD-YYYY HH:mm:ss");
                // console.log(id);
                let payload = JSON.stringify({ id: id, random: crypto.randomBytes(256).toString('hex'), timestamp: timeStamp.toString() });
                // const encrypt = crypto.createCipher('aes-128-cbc', 'd03a4db043');
                payload = cipher.encrypt(payload);
                const jwtToken = jsonwebtoken.sign({ 'payload': payload }, config.jwt_secret, { expiresIn: 86400 });
                // const secret = speakeasy.generateSecret({ length: 20 });

                return res.status(200).json({
                  msg: 'Logged In',
                  token: jwtToken,
                });
              }
            });


          }
        });
        st.complete();
      });

    });

  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/disable2fa', passport.authenticate('jwt', { session: true }), function (req, res, next) {
  try {
    req.setTimeout(0, null);
    const token = req.headers.authorization.toString().split(' ');

    jsonwebtoken.verify(token[1], config.jwt_secret, function (err, decoded) {
      // @ts-ignore
      const payload = cipher.decrypt(decoded.payload);
      const obj = JSON.parse(payload);
      const id = obj.id;

      databaseFactory.create((st, dbErr) => {
        if (dbErr) {
          return res.status(500).json({
            title: 'Database error: ' + dbErr.message ? dbErr.message : dbErr
          });
        }
        const login = new loginDAL(st);

        login.disable2FA(id, (result, error) => {
          if (error) {
            return res.status(500).json({
              title: 'Database error: ' + error.message
            });
          } else {

            login.getUserDetails(id, (data: any, totalErr) => {
              if (totalErr) {
                return res.status(500).json({
                  title: 'Database error: ' + totalErr.message
                });
              } else {
                const timeStamp = data[0].timeStamp;
                // console.log('crypto',crypto.randomBytes(256).toString('hex'));
                // var currentDate = moment().utc().format("MM-DD-YYYY HH:mm:ss");
                // console.log(id);
                let tokenPayload = JSON.stringify({ id: id, random: crypto.randomBytes(256).toString('hex'), timestamp: timeStamp.toString() });
                // const encrypt = crypto.createCipher('aes-128-cbc', 'd03a4db043');
                tokenPayload = cipher.encrypt(tokenPayload);
                const userToken = jsonwebtoken.sign({ 'payload': tokenPayload }, config.jwt_secret, { expiresIn: 86400 });
                // const secret = speakeasy.generateSecret({ length: 20 });

                return res.status(200).json({
                  msg: 'Logged In',
                  token: userToken,
                });
              }
            });
          }
        });
        st.complete();
        // });
      });

    });
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});



router.get('/getlastBillIssuedDate', passport.authenticate('jwt', { session: true }), (req: Request, res: Response, next: NextFunction) => {

  try {
    req.setTimeout(0, null);

    databaseFactory.createnotrx((st, err) => {
      if (err) {
        return res.status(500).json({
          title: 'Database error: ' + err.message ? err.message : err
        });
      }
      const data = new loginDAL(st);
      data.getLatestBillIssueDate((latestDate, error) => {
        if (error) {
          return res.status(500).json({
            title: 'Database error: ' + error.message
          });
        }

        res.status(200).json({
          date: latestDate
        });
      });
      st.release();
    });

  } catch (err) {
    res.status(500).json({
      err: err
    });
  }
});

// require('./vendorController')(router, passport);
// require('./contactController')(router, passport);
// require('./contractController')(router, passport);
// require('./countryController')(router, passport);
// require('./planController')(router, passport);
// require('./vendorController')(router, passport);
// require('./uploadCenterController')(router, passport);
// require('./servicesController')(router, passport);
// require('./equipmentController')(router, passport);
// require('./accountController')(router, passport);
// require('./billController')(router, passport);
// require('./dashboardController')(router, passport);
// require('./noUsageController')(router, passport);
// require('./nonStandardUsageController')(router, passport);
// require('./topDataUsersController')(router, passport);
// require('./topSpendersController')(router, passport);
// require('./auditController')(router, passport);

// enable pre-flight
router.options('*', cors(options));

// Export the express.Router() instance to be used by server.ts
// @ts-ignore
export const apiController: Router = router;
