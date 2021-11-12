const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const display = require('./handlers/display');
const login = require('./routes/login');
const insert = require('./routes/forms');
const edit = require('./routes/edit');
const deleteData = require('./routes/delete');

const app = express();

app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(cookieParser());
app.use(express.static('public'));

app.use('/', login);
app.use('/new', insert);
app.use('/edit', edit);
app.use('/delete', deleteData);

app.get('/home', display.schedule);
app.get('/users', display.users);
app.get('/users/:id', display.userDetails);
app.get('/new/user', display.userForm);
app.get('/new/schedule', display.scheduleForm);

module.exports = app;
