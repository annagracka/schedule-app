const express = require('express');

const router = express.Router();
const db = require('../config/db');
const verify = require('../handlers/verify');
const insert = require('../handlers/insert');

router
  .route('/user')
  .post((req, res) => {
    const newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    };

    if (verify.isFieldEmpty(newUser)) {
      return res.status(418).send('Invalid data');
    }
    if (verify.isEmailInDatabase(newUser)) {
      return res.render('error', { error: 'Invalid data' });
    }

    const hash = insert.passwordEncrypt(newUser.password);
    const verifiedData = [newUser.first_name, newUser.last_name, newUser.email, hash];

    db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      verifiedData,
      (dbErr, dbRes) => {
        try {
          if (dbRes.rows === undefined) {
            res.render('error', { error: 'Invalid data' });
          } else {
            res.redirect('user');
          }
        } catch (e) {
          console.log(e);
          res.render('error', { error: 'Invalid data' });
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

    if(!verify.isEmailInDatabase(newDate)) {
      return res.render('error', { error: 'Email not found'})
    };

    verify.isDateAvailable(newDate);

    const addDate = `INSERT INTO schedule (user_id, day, start_at, end_at)
    VALUES ((SELECT id FROM users WHERE email='${newDate.email}'), '${newDate.day}', '${newDate.start_at}', '${newDate.end_at}');`;
    db.query(
      addDate,
      (dbErr, dbRes) => {
        if (dbErr) {
          console.log(dbErr);
        }
      },
    );

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
    res.status(200).redirect('schedule');
  });

module.exports = router;
