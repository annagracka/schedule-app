const express = require("express");
const db = require("../config/db");
const insert = require("../handlers/insert");

const router = express.Router();
const verify = require("../handlers/verify");
const logger = require("../config/logger");

router.route("/user").post(async (req, res) => {
  const newData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const emptyField = verify.isFieldEmpty(newData, res);
    if (emptyField) {
      return res.render("error", { error: "The email address already in use" });
    }

    const isEmail = await verify.isEmailInDatabase(newData, res);
    if (isEmail) {
      return res.render("error", { error: "The email address already in use" });
    }

    insert.verifiedUser(newData, res);
  } catch (error) {
    logger.log("error", `${error}`);
    res.status(400).render("error", { error: "Something went wrong" });
  }
});

router.route("/schedule").post(async (req, res) => {
  const newDate = {
    day: req.body.day,
    start_at: req.body.start_at,
    end_at: req.body.end_at,
  };

  async function isDateAvailable(date) {
    if (!date.start_at < date.end_at) {
      return false;
    }
    return db
      .query(
        `SELECT day, to_char(start_at, 'HH24:MI') AS start_at, to_char(end_at, 'HH24:MI') AS end_at FROM schedule WHERE schedule.user_id=(SELECT id FROM users WHERE email='${req.user.email}')`
      )
      .then((dbRes) => {
        const oldDate = dbRes.rows;

        for (let i = 0; i < oldDate.length; i += 1) {
          if (oldDate[i].day === date.day) {
            const earlierDate = date.end_at <= oldDate[i].start_at;
            const laterDate = oldDate[i].end_at <= date.start_at;
            if (!earlierDate && !laterDate) {
              return false;
            }
          }
        }
        return true;
      })
      .catch((dbErr) => logger.log("error", `${dbErr}`));
  }

  function verifiedDate(newDate, response) {
    const addDate = `INSERT INTO schedule (user_id, day, start_at, end_at)
    VALUES ((SELECT id FROM users WHERE email='${req.user.email}'), '${newDate.day}', '${newDate.start_at}', '${newDate.end_at}');`;
    db.query(addDate, () => {
      try {
        response.status(200).redirect("/");
        return;
      } catch (error) {
        logger.log("error", `${error}`);
        res.status(400).render("error", { error: "Something went wrong" });
      }
    });
  }

  try {
    const checkSchedule = await isDateAvailable(newDate, res);
    if (!checkSchedule) {
      res.render("error", { error: "Invalid dates" });
      return;
    }

    verifiedDate(newDate, res);
  } catch (error) {
    logger.log("error", `${error}`);
    res.status(400).render("error", { error: "Something went wrong" });
  }
});

module.exports = router;
