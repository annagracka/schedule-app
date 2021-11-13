const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const display = require('./handlers/display');
// const login = require('./routes/login');
const insert = require('./routes/forms');
const edit = require('./routes/edit');
const deleteData = require('./routes/delete');
const passport = require('passport');

const app = express();

const initializePassport = require('./config/passportConfig')

initializePassport(passport)

app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'andrzej',

  resave: false,

  saveUninitialized: false,
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());

app.use(express.static('public'));

// app.use('/', login);

app.get('/', checkAuthenticated, (req, res) => {res.render('login')});
app.post('/', passport.authenticate('local', {
        successRedirect: '/home', 
        failureRedirect: '/',
        // failureFlash (info o bledach, mozesz wrzucic gdzieniegdzie )
})
);

app.use('/new', checkNotAuthenticated, insert);
app.use('/edit',checkNotAuthenticated, edit);
app.use('/delete', checkNotAuthenticated, deleteData);

app.get('/home', checkNotAuthenticated, display.schedule);
app.get('/users', checkNotAuthenticated, display.users);
app.get('/users/:id', checkNotAuthenticated, display.userDetails);
app.get('/new/user', checkAuthenticated, display.userForm);
app.get('/new/schedule', checkNotAuthenticated, display.scheduleForm);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/home')
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
};


app.get('/logout', (req, res) => { req.logOut();
    // req.flash('success_msg', 'wylogowales sie')
    res.redirect('/')
});


module.exports = app;
