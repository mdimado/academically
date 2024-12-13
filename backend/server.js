const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

//mongodb connection
mongoose.connect('mongodb://localhost:27017/lms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//user schems
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  });

const User = mongoose.model('User', userSchema);

//course Schema
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  instructor: String
});

const Course = mongoose.model('Course', courseSchema);


const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ message: 'Access denied' });
  
    try {
      const verified = jwt.verify(token, 'your_jwt_secret');
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  };

// Routes

//authentication route
app.post('/auth/register', async (req, res) => {
    try {
      // Check if user already exists
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      // Create new user
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role || 'user' 
      });
  
      const savedUser = await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


app.post('/auth/login', async (req, res) => {
    try {
      // Check if user exists
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ message: 'Email not found' });
      }
  
      // Check password
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      // Create and assign token
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        'your_jwt_secret', // In production, use an environment variable
        { expiresIn: '24h' }
      );
  
      res.json({ token, role: user.role });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

//get courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add new course
app.post('/admin/courses', async (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    instructor: req.body.instructor
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//delete course
app.delete('/admin/courses/:id', async (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//update course

app.put('/admin/courses/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
  
    try {
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedCourse);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});