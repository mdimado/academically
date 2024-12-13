'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);

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

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/users/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Handle successful enrollment (you could show a success message)
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course._id} className="w-full">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{course.description}</p>
              <p className="text-sm">Duration: {course.duration}</p>
              <p className="text-sm">Instructor: {course.instructor}</p>
              <Button 
                onClick={() => handleEnroll(course._id)}
                className="mt-4"
              >
                Enroll
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseCatalog;