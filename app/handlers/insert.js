const bcrypt = require('bcrypt');
const db = require('../config/db');

function passwordEncrypt(userData) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userData, salt);
  return hash;
}

function randomString() {
  const randomChars = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return randomChars;
}

module.exports = {
  passwordEncrypt,
  randomString,
};
