const bcrypt = require("bcrypt");
const db = require("../config/db");
const logger = require("../config/logger");

function passwordEncrypt(userData) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userData, salt);
  return hash;
}

function randomString() {
  const randomChars =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return randomChars;
}

function verifiedUser(newData, res) {
  const hash = passwordEncrypt(newData.password);
  const verifiedData = [
    newData.first_name,
    newData.last_name,
    newData.email,
    hash,
  ];

  db.query(
    "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
    verifiedData,
    () => {
      try {
        logger.log("info", "New account has been created");
        return res.redirect("/");
      } catch (error) {
        logger.log("error", `${error}`);
        res.status(400).render("error", { error: "Something went wrong" });
      }
    }
  );
}

module.exports = {
  passwordEncrypt,
  randomString,
  verifiedUser,
};
