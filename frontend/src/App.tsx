import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });
  const [isAdmin] = useState(true); // Hardcoded for now

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
    setNewCourse({
      ...newCourse,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });
      fetchCourses();
      setNewCourse({ title: '', description: '', duration: '', instructor: '' });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await fetch(`http://localhost:3001/admin/courses/${courseId}`, {
        method: 'DELETE',
      });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>
      
      {isAdmin && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  name="title"
                  placeholder="Course Title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Textarea
                  name="description"
                  placeholder="Course Description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  name="duration"
                  placeholder="Duration (e.g., 10 hours)"
                  value={newCourse.duration}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  name="instructor"
                  placeholder="Instructor Name"
                  value={newCourse.instructor}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <Button type="submit">Add Course</Button>
            </form>
          </CardContent>
        </Card>
      )}

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
              {isAdmin ? (
                <Button 
                  onClick={() => handleDelete(course._id)}
                  variant="destructive"
                  className="mt-4"
                >
                  Delete Course
                </Button>
              ) : (
                <Button className="mt-4">Enroll</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;