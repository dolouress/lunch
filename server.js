const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const User = require('./models/user');
const Food = require('./models/food');
const Recipe = require('./models/recipe');

// Configure session middleware
app.use(session({
  secret: 'miaskey',
  resave: false,
  saveUninitialized: false
}));


// Middleware to parse JSON data
app.use(express.json());

// Route handler for creating a new user
app.post('/signup', (req, res) => {
  const user = req.body;

  User.saveUserData(user, (error, userId) => {
    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ success: false, message: 'Error creating user' });
    }

    console.log('User created successfully. User ID:', userId);
    req.session.userId = userId;
    return res.status(200).json({ success: true, message: 'User created successfully' });
  });
});

// Route to add a new recipe
app.post('/recipe', (req, res) => {
  const recipe = req.body;

  Recipe.addRecipe(recipe, (error, recipeId) => {
    if (error) {
      console.error('Error adding recipe:', error);
      res.status(500).json({ error: 'Failed to add recipe' });
    } else {
      res.status(201).json({ recipeId: recipeId });
    }
  });
});


// Route handler for user login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findByEmail(email, (error, user) => {
    if (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ success: false, message: 'Error finding user' });
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // User authentication successful
    req.session.userId = user.user_id;
    return res.status(200).json({ success: true, message: 'User authentication successful' });
  });
});

//SHOWING USERS FOOD ON MY FOOD PRODUCTS.HTML
app.get('/user-food', (req, res) => {
  const userId = 1; //req.session.userId;
  // Log the value of userId
  console.log('User ID:', userId);
  
  Food.findFoodByUserId(userId, (error, results) => {
    if (error) {
      console.error('Error retrieving user food:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('User food:', results);
      res.json(results);
    }
  });
});

//SHOWING food recipes Of MY FOOD PRODUCTS.HTML
app.get('/recipe-food', (req, res) => {
  const userId = 1; //req.session.userId;
  const sort = req.query.sort;
  // Log the value of userId
  console.log('User ID:', userId);
  // Check if sorting parameter is provided
  if (sort === 'difficulty') {
    // Sort recipes by difficulty
    Recipe.possibleRecipeSortedByDifficulty(userId,(error, results) => {
      if (error) {
        console.error('Error retrieving sorted recipes:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving sorted recipes' });
      }
      return res.json(results);
    });
  } 
  else if (sort === 'rating') {
    // Sort recipes by rating
    Recipe.possibleRecipeSortedByRating(userId, (error, results) => {
      if (error) {
        console.error('Error retrieving sorted recipes:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving sorted recipes' });
      }
      return res.json(results);
    });
  } 
  else if (sort === 'expDate') {
    // Sort recipes by rating
    Recipe.possibleRecipeSortedByExpDate(userId, (error, results) => {
      if (error) {
        console.error('Error retrieving sorted recipes:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving sorted recipes' });
      }
      return res.json(results);
    });
  } 
  else {
      // Fetch all recipes
    Recipe.possibleRecipe(userId, (error, results) => {
      if (error) {
        console.error('Error retrieving recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Recipes:', results);
        res.json(results);
      }
    });
  }
});

//ADDING USERS NEW FOOD
app.post('/foods', (req, res) => {
  const foodName = req.body.name;
  const expirationDate = req.body.expirationDate;

  Food.addFood(foodName, (error, foodId) => {
    if (error) {
      console.error('Error adding food:', error);
      res.status(500).json({ error: 'Failed to add food item' });
      return;
    }

    // Retrieve the newly inserted foodId and pass it to addUserFood
    const userId = 1;
    Food.addUserFood(userId, foodId, expirationDate, (error, userFoodId) => {
      if (error) {
        console.error('Error adding user food:', error);
        res.status(500).json({ error: 'Failed to add food item' });
        return;
      }

      res.status(201).json({ message: 'Food item added successfully' });
    });
  });
});


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
