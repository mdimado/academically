'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:3001/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to add courses');
        return;
      }

      const response = await fetch('http://localhost:3001/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add course');
      }

      const data = await response.json();
      
      // Reset form and refresh courses
      setFormData({
        title: '',
        description: '',
        duration: '',
        instructor: ''
      });
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      setError(error.message || 'Failed to add course');
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to delete courses');
        return;
      }

      const response = await fetch(`http://localhost:3001/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete course');
      }

      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      setError(error.message || 'Failed to delete course');
    }
  };

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="title"
                placeholder="Course Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Textarea
                name="description"
                placeholder="Course Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Input
                name="duration"
                placeholder="Duration (e.g., 8 weeks)"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Input
                name="instructor"
                placeholder="Instructor Name"
                value={formData.instructor}
                onChange={handleInputChange}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit">Add Course</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.description}</p>
                  <p className="text-sm text-gray-500">Duration: {course.duration}</p>
                  <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseManagement;