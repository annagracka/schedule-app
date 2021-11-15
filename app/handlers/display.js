const db = require('../config/db');

function renderSchedule(req, res) {
  db.query(
    `UPDATE schedule
    SET work_time = end_at - start_at
    RETURNING *;`,
    (dbErr, dbRes) => {
      try {
        res.status(200);
      } catch {
        res.status(400).send(dbErr);
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
      try {
        res.render('index', { schedule: dbRes.rows });
      } catch {
        res.status(400).send(dbErr);
      }
    },
  );
}

function renderUsers(req, res) {
  db.query(
    'SELECT first_name, last_name, id FROM users',
    (dbErr, dbRes) => {
      try {
        res.render('users', { users: dbRes.rows })
      } catch {
        res.status(400).send(dbErr);
      };
    },
  );
}

function renderUserDetails(req, res) {
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
      } catch {
        res.status(400).send('Something went wrong');
      }
    },
  );
}

function renderUserForm(req, res) {
  res.render('new-user');
}

function renderScheduleForm(req, res) {
  res.render('new-schedule');
}

module.exports = {
  renderSchedule,
  renderUsers,
  renderUserDetails,
  renderUserForm,
  renderScheduleForm,
};
