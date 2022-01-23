const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db");
const logger = require("./logger");

function initialize(passport, res) {
  const authenticateUser = (email, password, done) => {
    db.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (dbErr, dbRes) => {
        if (dbErr) {
          res.send(400).send(dbErr);
        }
        if (dbRes.rows.length > 0) {
          const user = dbRes.rows[0];

          bcrypt.compare(password, user.password, (passErr, isValid) => {
            if (passErr) {
              return next(passErr);
            }
            if (isValid) {
              logger.log("info", "User logged");
              return done(null, user);
            }
            // info, np. flash
            console.log("password incorrect");
            return done(null, false);
          });
        } else {
          // info, np. flash
          console.log("nie ma takiego @");
          return done(null, false);
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM users WHERE id = $1", [id], (dbErr, dbRes) => {
      if (dbErr) {
        return done(dbErr);
      }
      return done(null, dbRes.rows[0]);
    });
  });
}

module.exports = initialize;
