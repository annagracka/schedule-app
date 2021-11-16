const express = require('express');
const db = require('../config/db');
const insert = require('../handlers/insert');

const router = express.Router();
const verify = require('../handlers/verify');

router
  .route('/user')
  .post(async (req, res, next) => {
    const newData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    };
    try {
      await verify.isFieldEmpty(newData, res);

      verify.isEmailInDatabase(newData, res);

      insert.verifiedUser(newData, res);

    } catch (error) {
      return next(error)
    };
    
  });

router
  .route('/schedule')
  .post(async (req, res, next) => {
    const newDate = {
      day: req.body.day,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
    };

    try {
      await isDateAvailable(newDate, res);
      await verifiedDate(newDate, res);
    } catch(e) {
    return next(error);
  };

    function isDateAvailable(date, response) {
      const q = `SELECT day, start_at, end_at FROM schedule WHERE schedule.user_id=(SELECT id FROM users WHERE email='${newDate.email}')`;
      db.query(q, (dbErr, dbRes) => {
        const oldDate = dbRes.rows;

        for (let i = 0; i < oldDate.length; i += 1) {
          if (oldDate[i].day === newDate.day) {
            const firstApprovedVer = ((date.start_at < date.end_at) && (date.end_at <= oldDate.start_at) && (oldDate.start_at < oldDate.end_at));
            const secApprovedVer = ((oldDate.start_at < oldDate.end_at) && (oldDate.end_at < date.start_at) && (date.start_at < date.end_at));

            if (firstApprovedVer && secApprovedVer) {
              return response.redirect('home');
            } else {
              return response.status(400).render('error', { error: 'Incorrect date' });
            }
          }
          //
        }
      });
    }

    function verifiedDate(newDate, res) {
      const addDate = `INSERT INTO schedule (user_id, day, start_at, end_at)
    VALUES ((SELECT id FROM users WHERE email='${req.user.email}'), '${newDate.day}', '${newDate.start_at}', '${newDate.end_at}');`;
    db.query(
      addDate,
      (dbErr, dbRes) => {
        try {
          return res.status(200).redirect('/');
        } catch {
          return res.status(400).render('error', { error: 'Something went wrong' });
        }
      },
    );
    }
    
  });

module.exports = router;
