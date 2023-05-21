const connection = require('../config/database.js');

// Create the User model
const Review = {
  // Create a new user
  addReview: (toUser, byUser, review, callback) => {
    const query = 'INSERT INTO review (to_user_id, by_user_id, rating, comment) VALUES (?, ?, ?, ?)';

    connection.query(query, [toUser, byUser, review.rating, review.comment], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results.insertId);
    });
  }
}

module.exports = Review;