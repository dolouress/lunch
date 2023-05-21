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

    // Get user profile data by foodId
  getUserProfileData: (userId, callback) => {
    const query = `
      SELECT u.name, u.surname, u.phone, u.email
      FROM user AS u
      WHERE u.user_id = ?;
    `;

    connection.query(query, [userId], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      if (results.length === 0) {
        return callback('No user profile found for the given userId.', null);
      }

      const userProfileData = {
        name: results[0].name,
        surname: results[0].surname,
        phone: results[0].phone,
        email:results[0].email
      };

      return callback(null, userProfileData);
    });
  }
};

module.exports = User;
