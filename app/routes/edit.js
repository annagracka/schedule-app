const db = require('../config/db');
const express = require('express');

const router = express.Router();
const { Router } = require('express');

router
  .route('/schedule/:id')
  .get((req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM schedule WHERE id = $1'), [id], (dbErr, dbRes) => {
      try {
        res.render('edit-schedule');
      } catch (e) {
        console.log(dbErr);
      }
    }; res.render('edit-schedule');
    // tu wykprzystaj req do wstawienia placeholdera ze starymi wartosciami
  });
// .post((req, res, next) => {
//   const newDate = {
//     email: req.body.email,
//     day: req.body.day,
//     start_at: req.body.start_at,
//     end_at: req.body.end_at,
//   };

//   const { id } = req.params;
//   const updateDate = `UPDATE schedule SET day = $1, start_at = $2, end_at = $3 WHERE user_id=${id};`;
//   db.query(
//     updateDate,
//     (dbErr, dbRes) => console.log('brakuje error handling'),
//   );

//   res.status(200).redirect('schedule');
// });

module.exports = router;
