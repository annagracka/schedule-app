const express = require('express');
const db = require('../config/db');

const router = express.Router();
const logger = require('../config/logger');

router
  .route('/user/:id')
  .post((req, res) => {
    const { id } = req.params;
    db.query(
      'WITH schedule AS (DELETE FROM users WHERE id = $1 RETURNING $1) DELETE FROM schedule WHERE user_id = $1',
      [id],
      () => {
        try {
          res.redirect('/users');
        } catch (error) {
          logger.log('error', `${error}`);
          res.status(400).render('error', { error: 'Something went wrong' });
        }
      },
    );
  });

router
  .route('/schedule/:id')
  .post((req, res) => {
    const { id } = req.params;
    db.query(
      'DELETE FROM schedule WHERE id = $1',
      [id],
      () => {
        try {
          res.redirect('/home');
        } catch (error) {
          logger.log('error', `${error}`);
          res.status(400).render('error', { error: 'Something went wrong' });
        }
      },
    );
    res.redirect('/home');

    // redirect do user-details okreslonego uzytkownika
  });

module.exports = router;
