const bcrypt = require('bcrypt');

function passwordEncrypt(userData) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userData, salt);
  return hash;
}

module.exports = {
  passwordEncrypt,
};
