const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost', //'https://www.studenti.famnit.upr.si/phpmyadmin/SIS2023',
  user: 'root',//'codeigniter',
  password: '',//'codeigniter2019',
  database: 'SISIII2023_89211025',
});

conn.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = conn;
