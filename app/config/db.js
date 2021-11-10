const { Pool } = require('pg');

const db = new Pool({
  database: 'schedules',
  user: 'postgres',
  password: 'schedules123',

  host: 'localhost',
  port: 5432,
});

db.connect();

module.exports = db;
