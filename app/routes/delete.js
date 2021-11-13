const express = require('express');

const router = express.Router();
const db = require('../config/db');

router
  .route('/user/:id')
  .post((req, res) => {
    const { id } = req.params;
    db.query('WITH schedule AS (DELETE FROM users WHERE id = $1 RETURNING $1) DELETE FROM schedule WHERE user_id = $1', [id], (dbErr, dbRes) => {
      if (dbErr) {
        console.log(dbErr);
      } else {
        res.redirect('/users');
      }
    });
  });

router
  .route('/schedule/:id')
  .post((req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM schedule WHERE id = $1', [id], (dbErr, dbRes) => {
      try {
        res.redirect('/home');
      } catch (e) {
        console.log(e);
      }
    });
    res.redirect('/home');
    // redirect do user-details okreslonego uzytkownika
  });

module.exports = router;
