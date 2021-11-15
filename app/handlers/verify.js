const db = require('../config/db');

function isFieldEmpty(form) {
  for (const [key, value] of Object.entries(form)) {
    if (!value) {
      return true;
    }
  } return false;
}

async function isEmailInDatabase(user, res) {
  db.query(
    'SELECT * FROM users WHERE email = $1',
    [user.email],
  //   (dbErr, dbRes) => {
  //     const userDB = JSON.stringify(dbRes.rows[0].email)
  //     console.log(`z formularza: ${user.email}; z db: ${userDB}`)
  //     try {
  //       return (dbRes.rows.length > 0);
  //     } catch {
  //       res.status(400).send('Something went wrong');
  //     }
    // },
    (dbErr, dbRes) => {
      const { count } = dbRes.rows[0];
      if (count !== '0') {
        return true;
      } else {
        return false;
      }
    }
  );
    
}

// function isDateAvailable(newDate, res) {
//   const q = `SELECT day, start_at, end_at FROM schedule WHERE schedule.user_id=(SELECT id FROM users WHERE email='${newDate.email}')`;
//   db.query(q, (dbErr, dbRes) => {
//     const oldDate = dbRes.rows;

//     for (let i = 0; i < oldDate.length; i += 1) {
//       if (oldDate[i].day === newDate.day) {
//         const firstApprovedVer = ((newDate.start_at < newDate.end_at) && (newDate.end_at <= oldDate.start_at) && (oldDate.start_at < oldDate.end_at));
//         const secApprovedVer = ((oldDate.start_at < oldDate.end_at) && (oldDate.end_at < newDate.start_at) && (newDate.start_at < newDate.end_at));

//         if (firstApprovedVer && secApprovedVer) {
//           return;
//         }
//       }
//     }
//   });
// }

function ifAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home');
  }
  next();
}

function ifNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = {
  isFieldEmpty,
  isEmailInDatabase,
  // isDateAvailable,
  ifAuthenticated,
  ifNotAuthenticated,
};
