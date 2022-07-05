const db = require("../config/db");
const logger = require("../config/logger");

function renderSchedule(_req, res) {
  db.query(
    `UPDATE schedule
    SET work_time = end_at - start_at
    RETURNING *;`,
    () => {
      try {
        res.status(200);
      } catch (error) {
        logger.log("error", `${error}`);
        res.status(400).send.render("error", { error: "Something went wrong" });
      }
    }
  );

  db.query(
    `SELECT first_name, day,
    to_char(start_at, 'HH24:MI') AS start_at,
    to_char(end_at, 'HH24:MI') AS end_at,
    extract(HOUR FROM work_time) AS hour,
    extract(MINUTE FROM work_time) AS minute,
    user_id FROM schedule
    JOIN users ON users.id = schedule.user_id`,
    (_dbErr, dbRes) => {
      try {
        res.render("index", { schedule: dbRes.rows });
      } catch (error) {
        logger.log("error", `${error}`);
        res.status(400).send.render("error", { error: "Something went wrong" });
      }
    }
  );
}

function renderUsers(_req, res) {
  db.query("SELECT first_name, last_name, id FROM users", (_dbErr, dbRes) => {
    try {
      res.render("users", { users: dbRes.rows });
    } catch (error) {
      logger.log("error", `${error}`);
      res.status(400).send.render("error", { error: "Something went wrong" });
    }
  });
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
    (_dbErr, dbRes) => {
      try {
        if (dbRes.rows[0] === undefined) {
          res.render("error", { error: "User has no schedule" });
        } else if (id !== req.user.id) {
          res.render("user-details", { userDetails: dbRes.rows });
        } else {
          res.render("logged-user-details", { userDetails: dbRes.rows });
        }
      } catch (error) {
        logger.log("error", `${error}`);
        res.status(400).send.render("error", { error: "Something went wrong" });
      }
    }
  );
}

function renderUserForm(_req, res) {
  res.render("new-user");
}

function renderScheduleForm(_req, res) {
  res.render("new-schedule");
}

module.exports = {
  renderSchedule,
  renderUsers,
  renderUserDetails,
  renderUserForm,
  renderScheduleForm,
};
