const db = require('../config/db');

function isFieldEmpty(form) {
  for (const [key, value] of Object.entries(form)) {
    if (!value) {
      return true;
    }
  } return false;
}

function isEmailInDatabase(newUser) {
  db.query(
    'SELECT COUNT(*) AS count FROM users WHERE email = $1',
    [newUser.email],
    (dbErr, dbRes) => {
      const { count } = dbRes.rows[0];
      if (count === '1') {
        return true;
      }
    },
  );
}

function isDateAvailable(newDate) {
  const q = `SELECT day, start_at, end_at FROM schedule WHERE schedule.user_id=(SELECT id FROM users WHERE email='${newDate.email}')`;
  db.query(q, (dbErr, dbRes) => {
    const oldDate = dbRes.rows;

    for (let i = 0; i < oldDate.length; i += 1) {
      if (oldDate[i].day === newDate.day) {
        const firstApprovedVer = ((newDate.start_at < newDate.end_at) && (newDate.end_at <= oldDate.start_at) && (oldDate.start_at < oldDate.end_at));
        const secApprovedVer = ((oldDate.start_at < oldDate.end_at) && (oldDate.end_at < newDate.start_at) && (newDate.start_at < newDate.end_at));

        if (firstApprovedVer && secApprovedVer) {
          return;
        }
      } return res.render('error', { error: 'Invalid data' });
    }
  });
}

module.exports = {
  isFieldEmpty,
  isEmailInDatabase,
  isDateAvailable,
};
