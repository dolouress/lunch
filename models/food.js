const connection = require('../config/database.js');

const Food = {
  findFoodByUserId: (userId, callback) => {
    const query = `
      SELECT f.name, uf.expiration_date
      FROM food AS f
      JOIN user_food AS uf ON f.food_id = uf.food_id
      WHERE uf.user_id = ?;
    `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding food:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
  addFood: (foodName, callback) => {
    // Check if the food item already exists in the food table
    const checkQuery = 'SELECT food_id FROM food WHERE name = ?';
    connection.query(checkQuery, [foodName], (error, results) => {
      if (error) {
        console.error('Error checking food existence:', error);
        return callback(error, null);
      }

    if (results.length > 0) {
      // Food item already exists, retrieve the foodId
      const foodId = results[0].food_id;
      return callback(null, foodId);
    } else {
      // Food item doesn't exist, insert a new entry in the food table
    const query = 'INSERT INTO food (name) VALUES (?)';
    connection.query(query, [foodName], (error, results) => {
      if (error) {
        console.error('Error adding food:', error);
        return callback(error, null);
      }
      return callback(null, results.insertId);
    });
  }
  });
},

  addUserFood: (userId, foodId, expirationDate, callback) => {
    const query = 'INSERT INTO user_food (user_id, food_id, expiration_date) VALUES (?, ?, ?)';
    const values = [userId, foodId, expirationDate];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error adding user food:', error);
        return callback(error, null);
      }
      return callback(null, results.insertId);
    });
  }
}


module.exports = Food;
