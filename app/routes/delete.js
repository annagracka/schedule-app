const express = require('express');
const db = require('../config/db');

const router = express.Router();

router
  .route('/user/:id')
  .post((req, res) => {
    const { id } = req.params;
    db.query('WITH schedule AS (DELETE FROM users WHERE id = $1 RETURNING $1) DELETE FROM schedule WHERE user_id = $1', [id], (dbErr, dbRes) => {
      try {
        res.redirect('/users');
      } catch {
        return res.send('Something went wrong');
      }
    });
  });

router
  .route('/schedule/:id')
  .post((req, res, next) => {
    const { id } = req.params;
    db.query('DELETE FROM schedule WHERE id = $1', [id], (dbErr, dbRes) => {
      try {
        res.redirect('/home');
      } catch (error){
        return next(error)
      }
    });
    res.redirect('/home');
    // redirect do user-details okreslonego uzytkownika
  });

module.exports = router;
