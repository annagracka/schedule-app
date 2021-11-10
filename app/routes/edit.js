const { Router } = require('express');
const express = require('express');

const router = express.Router();
const db = require('../config/db');

router
  .route('/schedule/:id')
  .get((req, res, next) => {
    res.render('new-schedule');
  })
  .post((req, res, next) => {
    const newDate = {
      email: req.body.email,
      day: req.body.day,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
    };

    const { id } = req.params;
    const updateDate = `UPDATE schedule SET day = $1, start_at = $2, end_at = $3 WHERE user_id=${id};`;
    db.query(
      updateDate,
      (dbErr, dbRes) => console.log('brakuje error handling'),
    );

    res.status(200).redirect('schedule');
  });

module.exports = router;
