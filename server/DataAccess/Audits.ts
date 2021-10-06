// import { getString } from '../Entities/Common/getString';
// import { isNumber } from 'util';
// import { dateFormat } from '../Entities/Common/dateFormat';

class Audits {
    transaction;
    resultResponse: any;
    errorResponse: any;
  
    constructor(st) {
      this.transaction = st;
    }
  
    addData(query, callback) {
      const sqlQuery = `UPDATE audit_settings SET
        are_international_calls_standard = ?,
        non_standard_usage_level = ?,
        no_usage_call_fwd_level = ?,
        no_usage_min_months_to_report = ?,
        num_top_spenders = ?,
        num_mobile_top_data_users =?,
        updated_timestamp = NOW()
        WHERE id=1`;
      this.transaction.query(sqlQuery,
        [query.options.intCalls, query.options.nonStandard, query.options.ignoreCalls, query.options.noUsage, query.options.spenders, query.options.dataUsers],
        (error, result) => {
          return callback(result, error);
        });
    }
  
    getData(query, callback) {
      const sqlQuery = `SELECT * FROM audit_settings
          WHERE id=1
          LOCK IN SHARE MODE`;
      this.transaction.query(sqlQuery,
        [],
        (error, result) => {
          return callback(result, error);
        });
    }
  
    preCompute(callback) {
      const sqlQuery = `CALL preCompute()`;
      this.transaction.query(sqlQuery,
        [],
        (result, error) => {
          return callback(result, error);
        });
    }
  
    endPreCompute() {
      this.transaction.query('UPDATE audit_settings SET is_precomputing = 0', [],
        (result, error) => {
          console.log(result, error);
        });
    }
  
    getPreComputeStatus(callback) {
      this.transaction.query('SELECT is_precomputing from audit_settings', [],
        (error, result) => {
          if (error || !result.length) {
            return callback(false, null);
          }
          return callback(result[0].is_precomputing === 0, null);
        });
    }
  
    getPreComputeStatusnotrx(callback) {
      this.transaction.query('SELECT is_precomputing from audit_settings', [],
        (result, error) => {
          if (error || !result.length) {
            return callback(false, null);
          }
          return callback(result[0].is_precomputing === 0, null);
        });
    }
  
    preComputeExpenseManagement(options, callback) {
      const dataUsers = options.dataUsers;
      const spenders = options.spenders;
      const query = 'SELECT DISTINCT bill_issue_month, bill_issue_year FROM bill_data_entries';
      this.transaction.query(query, [], (error, months) => {
        if (error) {
          return callback(null, error);
        }
        this.transaction.query('DELETE FROM top_data_users_precompute', [], (dataUsersErr, dataUsersResult) => {
          if (dataUsersErr) {
            return callback(null, dataUsersErr);
          }
          this.transaction.query('DELETE FROM top_spenders_precompute', [], (spendersErr, spendersResult) => {
            if (spendersErr) {
              return callback(null, spendersErr);
            }
            const promises = [];
            for (let i = 0; i < months.length; i++) {
              promises.push(this.preComputeTopSpenders(months[i].bill_issue_month, months[i].bill_issue_year, 'mobile', spenders));
              promises.push(this.preComputeTopSpenders(months[i].bill_issue_month, months[i].bill_issue_year, 'fixed', spenders));
              promises.push(this.preComputeTopDataUsers(months[i].bill_issue_month, months[i].bill_issue_year, dataUsers));
            }
            Promise.all(promises)
              .then(function (success) {
                return callback(true, null);
              })
              .catch(function (exc) {
                return callback(null, exc);
              });
          });
        });
      });
    }
  
    preComputeTopSpenders(month, year, serviceCategory, limit) {
      const spenderQuery = `
      INSERT INTO top_spenders_precompute
        SELECT
          top_spenders.id,
          service_number,
          service_category_description,
          service_category_code,
          full_name,
          email,
          location_address,
          department as description,
          top_spenders.charges_inc_tax as spend,
          location_latitude,
          location_longitude,
          bill_issue_month as month,
          bill_issue_year as year,
          bill_details_view_table.bill_id,
          bill_details_view_table.service_id,
          account_id,
          account_code,
          account_name,
          service_types.description AS service_type,
          top_spender_months
        FROM top_spenders
        INNER JOIN bill_details_view_table FORCE INDEX(bill_issue_month) ON bill_details_view_table.bill_id = top_spenders.bill_id
        LEFT OUTER JOIN service_types ON service_types.id = bill_details_view_table.service_type_id      WHERE
          bill_issue_month = ?
          AND bill_issue_year = ?
          AND service_category_code = ?
        GROUP BY top_spenders.id
        ORDER BY charges_inc_tax DESC
        LIMIT ?`;
      const transaction = this.transaction;
      return new Promise(function (resolve, reject) {
        transaction.query(spenderQuery, [month, year, serviceCategory, limit],
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(true);
          });
      });
    }
  
    preComputeTopDataUsers(month, year, limit) {
      const dataUsersQuery = `
      INSERT INTO top_data_users_precompute
      SELECT
        mobile_top_data_users.id,
        service_number,
        service_category_description,
        service_category_code,
        full_name,
        email,
        location_address,
        department AS description,
        location_latitude,
        location_longitude,
        bill_issue_month,
        bill_issue_year,
        usage_description_id,
        mobile_top_data_users.data_usage_gb as data_used,
        mobile_top_data_users.excess_data_charges as total_data_charges,
        accounts.id as account_id,
        bill_details_view_table.service_id,
        accounts.account_name,
        accounts.account_code,
        valid_service_type_view_table.id as service_type,
        valid_service_type_view_table.description as service_types,
        mobile_top_data_users.top_user_months
      FROM mobile_top_data_users
      INNER JOIN bill_details_view_table FORCE INDEX(bill_issue_month) ON mobile_top_data_users.bill_id = bill_details_view_table.bill_id
      INNER JOIN accounts ON account_id = accounts.id
      LEFT OUTER JOIN valid_service_type_view_table ON bill_details_view_table.service_type_id = valid_service_type_view_table.id
      LEFT OUTER JOIN service_categories ON bill_details_view_table.service_type_id = service_categories.service_type_id
      WHERE
        service_category_code = 'mobile'
        AND bill_issue_month = ?
        AND bill_issue_year = ?
        AND usage_description_id IN(25, 38)
      GROUP BY 1
      ORDER BY data_usage_gb DESC
      LIMIT ?`;
      const transaction = this.transaction;
      return new Promise(function (resolve, reject) {
        transaction.query(dataUsersQuery, [month, year, limit],
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(true);
          });
      });
    }
  }
  export const auditDAL = Audits;
  