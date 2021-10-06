// import { constants } from 'perf_hooks';

class Login {
    transaction;
    constructor(st) {
      this.transaction = st;
    }
  
    // getAuth(email, callback) {
    //   this.transaction.query(`SELECT
    //                           users.id, users.first_name, users.last_name, users.password, users.email, NOW() as timeStamp
    //                           FROM users
    //                           WHERE email = ?`,
    //     [email],
    //     (result, error) => {
    //       return callback(result, error);
    //     });
    // }

    getAuth(email, callback) {
        this.transaction.query(`SELECT
                                users.id, users.first_name, users.last_name, password, is_2fa_enabled, two_fa_secret_string, email, NOW() as timeStamp
                                FROM login_profiles
                                JOIN users
                                ON users.id=login_profiles.contact_id
                                WHERE email = ?`,
          [email],
          (result, error) => {
            return callback(result, error);
          });
      }
  
    update2FA(contactID, twoFA, secret, callback) {
      this.transaction.query(`UPDATE login_profiles
                              SET is_2fa_enabled = ?, two_fa_secret_string = ?
                              WHERE id = ?`,
        [twoFA, secret, contactID],
        (result, error) => {
          return callback(result, error);
        });
    }
  
    disable2FA(contactID, callback) {
      this.transaction.query(`UPDATE login_profiles
                              SET is_2fa_enabled = 0, two_fa_secret_string = NULL
                              WHERE id = ?`,
        [contactID],
        (result, error) => {
          return callback(result, error);
        });
    }
  
    changePassword(email, password, callback) {
      this.transaction.query('UPDATE login_profiles SET password = ? WHERE id = ?', [password, email], (result, error) => {
        if (error) {
          return callback(null, error);
        }
        this.transaction.query('Select NOW() AS timestamp FROM dual', [], (time, err) => {
          return callback(time[0].timestamp, err);
        });
      });
    }
  
    getUser(username, callback) {
      this.transaction.query(`SELECT
                              users.id
                              FROM users
                              WHERE id = ? or email = ?`,
        [username, username],
        (error, result) => {
          return callback(result, error);
        });
    }
  
    getUserDetails(id, callback) {
      this.transaction.query(`SELECT
        users.given_names,
        users.last_name,users.email,
        login_roles.description,
        login_profiles.updated_TIMESTAMP,
        NOW() as timeStamp
      FROM login_profiles
      JOIN users ON login_profiles.contact_id = users.id
      JOIN login_roles ON login_roles.id = login_profiles.role_id
      WHERE login_profiles.contact_id = ?`,
        [id],
        (result, error) => {
          return callback(result, error);
        });
    }
  
    getVerificationDetails(id, callback) {
      this.transaction.query(`SELECT
        login_profiles.updated_TIMESTAMP
      FROM login_profiles
      WHERE login_profiles.contact_id = ?`,
        [id],
        (result, error) => {
          return callback(result, error);
        });
    }
  
    getLatestBillIssueDate(callback) {
      this.transaction.query('SELECT max(bill_issue_date) AS last_date FROM bills', [], (error, result) => {
        return callback(result, error);
      });
    }
  }
  
  export const loginDAL = Login;
  