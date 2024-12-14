const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

//mongodb connection
mongoose.connect('mongodb+srv://mdimad005:3NdO97CXatpGJsWk@cluster0.xwdau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
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

//course schema
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  instructor: String
});

const Course = mongoose.model('Course', courseSchema);

//enrollment schema
const enrollmentSchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    enrolledCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    enrollmentDate: {
      type: Date,
      default: Date.now
    }
  });
  
  const Enrollment = mongoose.model('Enrollment', enrollmentSchema);


  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, 'academically');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'academically';

//routes

//authentication route
app.post('/auth/register', async (req, res) => {
    try {
      if (req.body.role === 'admin') {
        if (req.headers['admin-secret-key'] !== ADMIN_SECRET_KEY) {
          return res.status(403).json({ message: 'Invalid admin secret key' });
        }
      }
  
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role === 'admin' ? 'admin' : 'user'
      });
  
      const savedUser = await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


app.post('/auth/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ message: 'Email not found' });
      }
  
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        'academically', 
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
app.post('/admin/courses', authenticateToken, async (req, res) => {
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

//delete 
app.delete('/admin/courses/:id', authenticateToken, async (req, res) => {
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

//update
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

//enrollment routes
app.post('/users/enroll/:courseId', authenticateToken, async (req, res) => {
    console.log('Enrollment Request Details:');
    console.log('User ID:', req.user);  
    console.log('Course ID:', req.params.courseId);
    console.log('Request Headers:', req.headers);

    try {
      const userId = req.user._id;
      const courseId = req.params.courseId;
  
      const course = await Course.findById(courseId);
      if (!course) {
        console.log(`Course not found: ${courseId}`);
        return res.status(404).json({ message: 'Course not found' });
      }
  
      let enrollment = await Enrollment.findOne({ userId });
      
      if (!enrollment) {
        enrollment = new Enrollment({
          userId,
          enrolledCourses: [courseId]
        });
      } else {
        if (enrollment.enrolledCourses.includes(courseId)) {
          console.log(`Already enrolled: User ${userId}, Course ${courseId}`);
          return res.status(400).json({ message: 'Already enrolled in this course' });
        }
        enrollment.enrolledCourses.push(courseId);
      }
  
      await enrollment.save();
      res.status(200).json({ message: 'Successfully enrolled in course' });
    } catch (error) {
      console.error('Enrollment Error:', error);
      res.status(500).json({ 
        message: error.message,
        stack: error.stack 
      });
    }
  });
  
  // get enrolled courses for user
  app.get('/users/enrolled-courses', authenticateToken, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ userId: req.user._id });
    
    if (!enrollment) {
      return res.json({ enrolledCourses: [] });
    }
    
    const enrolledCourses = await Course.find({
      '_id': { $in: enrollment.enrolledCourses }
    });
    
    res.json({ enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});