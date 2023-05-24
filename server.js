const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const User = require('./models/user');
const Food = require('./models/food');
const Recipe = require('./models/recipe');
const Review = require('./models/review');
const connection = require('./config/database.js');


// Configure session middleware
app.use(session({
  secret: 'miaskey',
  resave: false,
  saveUninitialized: false
}));


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



//SHOWING USERS FOOD ON MY FOOD PRODUCTS.HTML
app.get('/user-food', (req, res) => {
  const userId = req.session.userId;
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
  const userId = req.session.userId;
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
    const userId = req.session.userId;
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

// MARKING FOOD AS OFFERED

app.post('/offer', (req, res) => {
  const foodId = req.body.foodId;
  const userfoodId = req.body.userfoodId;
  const userId = req.session.userId;

  // Update the is_offered field for the specified foodId
  const query = 'UPDATE user_food SET is_offered = 1 WHERE food_id = ? AND user_id = ? AND user_food_id = ?';
  connection.query(query, [foodId, userId, userfoodId], (error, results) => {
    if (error) {
      console.error('Error marking food as offered:', error);
      res.status(500).json({ message: 'Failed to mark food as offered' });
    } else {
      res.json({ message: 'Food marked as offered successfully' });
    }
  });
});


// MARKING FOOD AS NOT OFFERED
app.post('/dontoffer', (req, res) => {
  const foodId = req.body.foodId;
  const userId = req.session.userId;
  const userfoodId = req.body.userfoodId;

  // Update the is_offered field for the specified foodId
  const query = 'UPDATE user_food SET is_offered = 0 WHERE food_id = ? AND user_id = ? AND user_food_id = ?';
  connection.query(query, [foodId, userId,userfoodId], (error, results) => {
    if (error) {
      console.error('Error marking food as offered:', error);
      res.status(500).json({ message: 'Failed to mark food as offered' });
    } else {
      res.json({ message: 'Food marked as offered successfully' });
    }
  });
});

//SHOWING OFFERED FOOD ON blog.HTML
app.get('/location', (req, res) => {
  const userId = req.session.userId;
  // Log the value of userId
  console.log('User ID:', userId);
  
  User.location(userId, (error, results) => {
    if (error) {
      console.error('Error retrieving user location info:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//SHOWING USERS OFFERED FOOD ON blog.HTML
app.get('/offeredFood', (req, res) => {
  const userId = req.session.userId;
  // Log the value of userId
  console.log('User ID:', userId);
  
  Food.userOfferedFood(userId, (error, results) => {
    if (error) {
      console.error('Error retrieving user offered food:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('User offered food:', results);
      res.json(results);
    }
  });
});





app.get('/allOfferedFood', (req, res) => {
  const userId = req.session.userId;
  const sort = req.query.sort;

  // Log the value of userId
  console.log('User ID:', userId);
  // Check if sorting parameter is provided
  if (sort === 'expDate') {
    // Sort recipes by expDate
    Food.allOfferedFoodSortedByExpDate(userId,(error, results) => {
      if (error) {
        console.error('Error retrieving sorted food:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving sorted food' });
      }
      return res.json(results);
    });
  } 
  else if(sort === 'location'){
    // Sort recipes by location
    Food.allOfferedFoodSortedByLocation(userId,(error, results) => {
      if (error) {
        console.error('Error retrieving sorted food:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving sorted food' });
      }
      return res.json(results);
    });
  }
  else {
      // Fetch all offered food
      Food.allOfferedFood(userId, (error, results) => {
        if (error) {
          console.error('Error retrieving user offered food:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Other users offered food:', results);
          res.json(results);
        }
      });
  }
});
// Handle GET request for /userProfile/:userId
app.get('/userLocation', (req, res) => {
  const userId = req.session.userId;

  // Get the user profile data for the provided userId
  User.getUserLocationData(userId, (error, userLocationData) => {
    if (error) {
      // Handle the error case
      return res.status(500).send('Error retrieving user profile data');
    }

    // Send the user profile data as JSON
    res.json(userLocationData);
  });
});


// Handle GET request for /userProfile/:userId
app.get('/userProfile', (req, res) => {
  const userId = req.session.userId;

  // Get the user profile data for the provided userId
  User.getUserProfileData(userId, (error, userProfileData) => {
    if (error) {
      // Handle the error case
      return res.status(500).send('Error retrieving user profile data');
    }

    // Send the user profile data as JSON
    res.json(userProfileData);
  });
});



// Handle GET request for /userProfile/:userId
app.get('/userProfile/:userId', (req, res) => {
  const userId1 = req.params.userId;

  // Get the user profile data for the provided userId
  User.getUserProfileData(userId1, (error, userProfileData) => {
    if (error) {
      // Handle the error case
      return res.status(500).send('Error retrieving user profile data');
    }

    // Send the user profile data as JSON
    res.json(userProfileData);
  });
});

// Route handler for creating a new review
app.post('/addReview/:userId', (req, res) => {
  const review = req.body;
  const toUser = req.params.userId;
  const byUser = req.session.userId;

  Review.addReview(toUser, byUser, review, (error, reviewId) => {
    if (error) {
      console.error('Error creating review:', error);
      return res.status(500).json({ success: false, message: 'Error creating review' });
    }

    return res.status(200).json({ success: true, message: 'Review created successfully' });
  });
});

app.post('/update', (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const phone = req.body.phone;
  const country = req.body.country;
  const city = req.body.city;
  const address = req.body.address;
  const postalcode = req.body.postalcode;
  const userId = req.session.userId;

  // Create a new location record
  const createLocationQuery = 'INSERT INTO location (city, country, address, postal_code) VALUES (?, ?, ?,?)';
  connection.query(createLocationQuery, [city, country,address, postalcode], (error, locationCreateResults) => {
    if (error) {
      console.error('Error creating location:', error);
      // Handle the error
      return res.status(500).send('Error creating location');
    }

    // Retrieve the newly created location_id
    const locationId = locationCreateResults.insertId;
    console.log(locationId);

    // Update user data with the new location_id
    const updateUserQuery = 'UPDATE user SET name = ?, surname = ?, email = ?, phone = ?, location_id = ? WHERE user_id = ?';
    connection.query(updateUserQuery, [name, surname, email, phone, locationId, userId], (error, userUpdateResults) => {
      if (error) {
        console.error('Error updating user data:', error);
        // Handle the error
        return res.status(500).send('Error updating user data');
      }

      // Data updated successfully
      return res.status(200).send('Data updated successfully');
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
const port = 5048;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
