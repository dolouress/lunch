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
      SELECT DISTINCT r.name, r.description
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
  }
}

module.exports = Recipe;
