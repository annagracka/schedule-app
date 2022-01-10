# Schedule App
## _Time Management App for Teams_
---
Schedule is the app where you can track work time of employees. Every employee has his/her own account, where he can plan future work, as also, see past shifts.
The user can:
- create or log in into your account,
- add new working hours to your schedule,
- delete your old data from plan,
- see other employees' schedules,
---
## Features
- Only logged user can see schedule,
- Creating new account:
  - Validation process checks if the user:
    - has an unique email,
    - entered the password,
  - Before sending data to a database, password gets encrypted,
- Log in into account:
  - User has to enter his/her email and the password,
  - Data is validated in terms of presence of the email in the database and match of password,
- Logged user can add or delete shifts from his/her schedule,
  - added shifts must not overlap with any other,
  - user can see other's schedules,
  - user can't add and delete other employees' plans,

## Tech
To work properly schedule apps uses a few open source libraries and projects:

- [Node.js](http://nodejs.org)
- [Express](http://expressjs.com)
- [ejs](https://ejs.co/)

## Installation
Install the dependencies and devdependencies and start the server.
```sh
cd schedule-app
npm install app
```
In case of issues with installing bcrypt enter as follows:
```sh
npm install node-gyp -g
npm install bcrypt -g

npm install bcrypt --save
```

## Create .env file
To connect with postgreSQL database you need to create .env file in app dir:
> NODE_ENV=development <br />
> <br />
> PGUSER= <br />
> PGHOST= <br />
> PGDATABASE= <br />
> PGPASSWORD= <br />
> PGPORT= <br />
> PORT= <br />
> <br />

Create a database in postgreSQL and enter data into .env file.

#### Running app

```sh
npm start
```

## FUTURE TASKS

- [ ] Redesing and rewrite layout in [React](https://reactjs.org/)
- [ ] Display schedule as a calendar
- [ ] Hide characters during password entering
- [ ] Create Modals with status info
- [ ] Create confirmation emails tool
- [ ] Create remind password tool
- [ ] Add 'Edit schedule' feature
- [ ] Write more advanced validation
