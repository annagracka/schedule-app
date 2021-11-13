const db = require('../config/db');

function schedule(req, res) {
  db.query(
    `UPDATE schedule
    SET work_time = end_at - start_at
    RETURNING *;`,
    (dbErr, dbRes) => {
      if (dbErr) {
        console.log(dbErr);
      }
    },
  );

  db.query(
    `SELECT first_name, day,
    to_char(start_at, 'HH24:MI') AS start_at,
    to_char(end_at, 'HH24:MI') AS end_at,
    extract(HOUR FROM work_time) AS hour,
    extract(MINUTE FROM work_time) AS minute,
    user_id FROM schedule
    JOIN users ON users.id = schedule.user_id`,
    (dbErr, dbRes) => {
      if (dbErr) {
        return dbErr;
      } res.render('index', { schedule: dbRes.rows });
    },
  );
}

function users(req, res) {
  db.query(
    'SELECT first_name, last_name, id FROM users',
    (dbErr, dbRes) => {
      if (dbErr) {
        return console.log(dbErr);
      } res.render('users', { users: dbRes.rows });
    },
  );
}

function userDetails(req, res) {
  const { id } = req.params;
  db.query(
    `SELECT first_name, day,
    to_char(start_at, 'HH24:MI') AS start_at,
    to_char(end_at, 'HH24:MI') AS end_at,   
    extract(HOUR FROM work_time) AS hour,
    extract(MINUTE FROM work_time) AS minute,
    work_time, user_id, schedule.id FROM users, schedule WHERE users.id=$1 AND schedule.user_id=$1`,
    [id],
    (dbErr, dbRes) => {
      try {
        if (dbRes.rows[0] === undefined) {
          res.render('error', { error: 'User has no schedule' });
        } else {
          res.render('user-details', { userDetails: dbRes.rows });
        }
      } catch (e) {
        console.log(e);
      }
    },
  );
}

function userForm(req, res) {
  res.render('new-user');
}

function scheduleForm(req, res) {
  res.render('new-schedule');
}

module.exports = {
  schedule,
  users,
  userDetails,
  userForm,
  scheduleForm,
};
