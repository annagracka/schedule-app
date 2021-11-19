const express = require('express');
const db = require('../config/db');

const router = express.Router();
const logger = require('../config/logger');

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
  });

module.exports = router;
