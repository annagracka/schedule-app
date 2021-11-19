const express = require('express');
const flash = require('express-flash');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const deleteData = require('./routes/delete');
const display = require('./handlers/display');
const initializePassport = require('./config/passport');
const insert = require('./routes/forms');
const verify = require('./handlers/verify');

const app = express();

app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

initializePassport(passport);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'andrzej',

  resave: false,

  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(express.static('public'));

app.get('/', verify.ifAuthenticated, (req, res) => { res.render('login'); });
app.post('/', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/',
  // failureFlash (info o bledach, mozesz wrzucic gdzieniegdzie ) albo funcke z zad4
}));

app.use('/new', insert);
app.use('/delete', verify.ifNotAuthenticated, deleteData);

app.get('/home', verify.ifNotAuthenticated, display.renderSchedule);

app.get('/users', verify.ifNotAuthenticated, display.renderUsers);
app.get('/users/:id', verify.ifNotAuthenticated, display.renderUserDetails);

app.get('/new/user', verify.ifAuthenticated, display.renderUserForm);
app.get('/new/schedule', verify.ifNotAuthenticated, display.renderScheduleForm);

app.get('/logout', (req, res) => {
  req.logOut();
  // req.flash('success_msg', 'wylogowales sie')  albo funcke z zad4
  res.redirect('/');
});

module.exports = app;
