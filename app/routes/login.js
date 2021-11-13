const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cookieParser = require('cookie-parser');
const insert = require('../handlers/insert')
const bcrypt = require('bcrypt');

const authTokens = {};

router
  .route('/')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {
    const { email, password } = req.body;

    db.query(`SELECT id, password FROM users WHERE email = $1`, [email], (dbErr, dbRes) => {
      try {
        const userPassword = dbRes.rows[0]['password'];
        const userId = dbRes.rows[0]['id'];

      if (bcrypt.compare(password, userPassword)) {
        const authToken = insert.randomString();

        db.query(`UPDATE users SET auth_token = $1 WHERE id = ${userId}`, [authToken], (dbErr, dbRes) => {
          try {
            res.cookie('AuthToken', authToken)
            return res.redirect('home') // blad chyba jest ru
          }
          catch(e) {
            console.log('blad')
          }
        } )
      } else {
        return res.send('tak nie mozna')
      }
      }
      catch(e) {
        console.log(e);
      }
    })
  })

module.exports = router;
