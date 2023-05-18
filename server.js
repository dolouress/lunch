const express = require('express');
const app = express();
const path = require('path');
const User = require('./models/user');

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
    return res.status(200).json({ success: true, message: 'User created successfully' });
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
