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
  }
}

module.exports = Food;
