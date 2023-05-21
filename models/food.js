const connection = require('../config/database.js');

const Food = {
  findFoodByUserId: (userId, callback) => {
    const query = `
      SELECT f.food_id, f.name, uf.expiration_date, uf.is_offered, uf.user_food_id
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
  },


  userOfferedFood: (userId, callback) => {
    const query = `
      SELECT f.food_id, f.name, uf.expiration_date
      FROM food AS f
      JOIN user_food AS uf ON f.food_id = uf.food_id
      WHERE uf.user_id = ? AND uf.is_offered = 1;
    `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding offered food:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
  allOfferedFood: (userId, callback) => {
    const query = `
        SELECT f.food_id, f.name, uf.expiration_date, u.name AS user_name, l.city, l.country
        FROM food AS f
        JOIN user_food AS uf ON f.food_id = uf.food_id
        JOIN user AS u ON u.user_id = uf.user_id
        JOIN location AS l ON u.location_id = l.location_id
        WHERE uf.user_id != ? AND uf.is_offered = 1
  `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding offered food:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
  allOfferedFoodSortedByExpDate: (userId, callback) => {
    // Fetch recipes sorted by food exp date
    const query = `
    SELECT f.food_id, f.name, uf.expiration_date, u.name AS user_name, l.city, l.country
        FROM food AS f
        JOIN user_food AS uf ON f.food_id = uf.food_id
        JOIN user AS u ON u.user_id = uf.user_id
        JOIN location AS l ON u.location_id = l.location_id
        WHERE uf.user_id != ? AND uf.is_offered = 1
    ORDER BY uf.expiration_date 
    `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding sorted food:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
  allOfferedFoodSortedByLocation: (userId, userLocation, callback) => {
    const query = `
      SELECT f.food_id, f.name, uf.expiration_date, u.name AS user_name, l.city, l.country,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(l.latitude)) * cos(radians(l.longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(l.latitude))
          )
        ) AS distance
      FROM food AS f
      JOIN user_food AS uf ON f.food_id = uf.food_id
      JOIN user AS u ON u.user_id = uf.user_id
      JOIN location AS l ON u.location_id = l.location_id
      WHERE uf.user_id != ? AND uf.is_offered = 1
      ORDER BY distance;
    `;
    const values = [userLocation.latitude, userLocation.longitude, userLocation.latitude, userId];
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error finding offered food:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  }
  
  
  
}


module.exports = Food;
