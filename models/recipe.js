const connection = require('../config/database.js');

const Recipe = {
  possibleRecipe: (userId, callback) => {
    const query = `
    SELECT DISTINCT r.name, r.description, r.rating, r.difficulty
    FROM recipe_food AS rf
    JOIN user_food AS uf ON rf.food_id = uf.food_id
    JOIN recipe AS r ON rf.recipe_id = r.recipe_id
    WHERE uf.user_id = ?
    GROUP BY r.recipe_id
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
    JOIN user_food AS uf ON rf.food_id = uf.food_id
    JOIN recipe AS r ON rf.recipe_id = r.recipe_id
    WHERE uf.user_id = ?
    GROUP BY r.recipe_id
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
    JOIN user_food AS uf ON rf.food_id = uf.food_id
    JOIN recipe AS r ON rf.recipe_id = r.recipe_id
    WHERE uf.user_id = ?
    GROUP BY r.recipe_id
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
    JOIN user_food AS uf ON rf.food_id = uf.food_id
    JOIN recipe AS r ON rf.recipe_id = r.recipe_id
    WHERE uf.user_id = ?
    GROUP BY r.recipe_id
    ORDER BY uf.expiration_date ;
    `;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error finding sorted recipes:', error);
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
  addRecipe: (recipe, callback) => {
    const query = 'INSERT INTO recipe (name, description, difficulty) VALUES (?, ?, ?)';
    const values = [recipe.name, recipe.description, recipe.difficulty];

    connection.query(query, values, (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results.insertId);
    });
  }
}

module.exports = Recipe;
