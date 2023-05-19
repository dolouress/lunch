const connection = require('../config/database.js');

const Recipe = {
  possibleRecipe: (userId, callback) => {
    const query = `
      SELECT DISTINCT r.name, r.description
      FROM recipe_food AS rf
      JOIN user_food AS uf 
      JOIN recipe AS r
      ON rf.food_id = uf.food_id
      WHERE uf.user_id = ?;
    `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding recipes:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
  possibleRecipeSortedByDifficulty: (userId, callback) => {
    // Fetch recipes sorted by difficulty
    const query = `
      SELECT DISTINCT r.name, r.description, r.rating, r.difficulty
      FROM recipe_food AS rf
      JOIN user_food AS uf
      JOIN recipe AS r
      ON rf.food_id = uf.food_id
      WHERE uf.user_id = ?
      ORDER BY r.difficulty;
    `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding sorted recipes:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
  possibleRecipeSortedByRating: (userId, callback) => {
    // Fetch recipes sorted by rating
    const query = `
      SELECT DISTINCT r.name, r.description, r.rating, r.difficulty
      FROM recipe_food AS rf
      JOIN user_food AS uf
      JOIN recipe AS r
      ON rf.food_id = uf.food_id
      WHERE uf.user_id = ?
      ORDER BY r.rating DESC;
    `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding sorted recipes:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
  possibleRecipeSortedByExpDate: (userId, callback) => {
    // Fetch recipes sorted by food exp date
    const query = `
      SELECT DISTINCT r.name, r.description, r.rating, r.difficulty
      FROM recipe_food AS rf
      JOIN user_food AS uf
      JOIN recipe AS r
      ON rf.food_id = uf.food_id
      WHERE uf.user_id = ?
      ORDER BY uf.expiration_date ;
    `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding sorted recipes:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  }
}

module.exports = Recipe;
