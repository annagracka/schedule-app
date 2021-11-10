const express = require('express');

const router = express.Router();
const db = require('../config/db');

router
  .route('/')
  .get((req, res) => {
    res.render('login');
  });

module.exports = router;
