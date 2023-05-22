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

    // Get user profile data by userId
  getUserProfileData: (userId, callback) => {
    const query = `
      SELECT u.name, u.surname, u.phone, u.email, AVG(r.rating) AS average
      FROM user AS u
      JOIN review AS r ON u.user_id = r.to_user_id
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
        email:results[0].email,
        average: results[0].average
      };

      return callback(null, userProfileData);
    });
  },
   // Get user profile data by userId
   getUserLocationData: (userId, callback) => {
    const query = `
      SELECT l.country, l.city, l.address, l.postal_code
      FROM user AS u
      JOIN location AS l ON u.location_id = l.location_id
      WHERE u.user_id = ?;
    `;

    connection.query(query, [userId], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      if (results.length === 0) {
        //return callback('No user location found for the given userId.', null);
        const userLocationData = {
          country: '',
          city: '',
          address: '',
          postalcode:''
        };
        return callback(null, userLocationData);
      }

      const userLocationData = {
        country: results[0].country,
        city: results[0].city,
        address: results[0].address,
        postalcode:results[0].postal_code
      };

      return callback(null, userLocationData);
    });
  },
  //check if user has location so he can use offerings
  location: (userId, callback) => {
    const query = `
      SELECT u.location_id
      FROM user AS u 
      WHERE u.user_id = ? AND u.location_id IS NOT NULL;
    `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding users location:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
};

module.exports = User;
