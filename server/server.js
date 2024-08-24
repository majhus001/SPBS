const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RegisterModel = require('./models/Register');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your_super_secret_key'; // Replace with your own secure key

mongoose.connect('mongodb://localhost:27017/user', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/register', async (req, res) => {
  const { name, email, phno, uname, upass } = req.body;

  try {
    const existingUser = await RegisterModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(upass, 10);
    const newUser = new RegisterModel({
      Name: name,
      email: email,
      Phoneno: phno,
      Username: uname,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Account created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await RegisterModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
