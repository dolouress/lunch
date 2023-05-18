const connection = require('../config/database.js');

// Create the User model
const User = {
  // Create a new user
  saveUserData: (user, callback) => {
    const query = 'INSERT INTO user (name, surname, email, password, phone) VALUES (?, ?, ?, ?, ?)';
    const values = [user.name, user.surname, user.email, user.password, user.phone];

    connection.query(query, values, (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results.insertId);
    });
  },

  // Find a user by email
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM user WHERE email = ?';
    connection.query(query, [email], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results[0]);
    });
  },

  // Other database operations for User model can be defined here...
};

module.exports = User;
