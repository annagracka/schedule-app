const express = require('express');
const db = require('../config/db');
const insert = require('../handlers/insert');

const router = express.Router();
const verify = require('../handlers/verify');

router
  .route('/user')
  .post((req, res) => {
    const newData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    };

    verify.isFieldEmpty(newData, res);

    if (verify.isEmailInDatabase(newData, res)) {
      res.render('error', { error: 'The email address already in use' });
      
    } else {return true}

    const hash = insert.passwordEncrypt(newData.password);
    const verifiedData = [newData.first_name, newData.last_name, newData.email, hash];

    db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      verifiedData,
      (dbErr, dbRes) => {
        try {
          return res.redirect('/');
        } catch {
          return res.render('error', { error: 'Invalid data, dodac tego nie moglam' });
        }
      },
    );
  });

router
  .route('/schedule')
  .post((req, res) => {
    const newDate = {
      email: req.body.email,
      day: req.body.day,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
    };

    // jeblo w obu weryfikacjach, jutro jak bedzie sila
    if (verify.isEmailInDatabase(newDate, res) === false) {
      return res.render('error', { error: 'Email not found' });
    }

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
            }
            console.log('error w datach');
            return response.render('new-schedule');
          }
          //
        }
      });
    }

    // ni edialaaaaaa
    isDateAvailable(newDate, res);

    const addDate = `INSERT INTO schedule (user_id, day, start_at, end_at)
    VALUES ((SELECT id FROM users WHERE email='${newDate.email}'), '${newDate.day}', '${newDate.start_at}', '${newDate.end_at}');`;
    db.query(
      addDate,
      (dbErr, dbRes) => {
        try {
          res.status(200).redirect('/');
        } catch {
          res.status(400).send('Something went wrong');
        }
      },
    );
  });

module.exports = router;
