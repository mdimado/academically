'use client'
import React, { useState, useEffect } from 'react';

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
    <div className="p-8 bg-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Add New Course Section */}
        <div className="border-4 border-black p-8 
          shadow-[8px_8px_0_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-bold uppercase mb-6 
            bg-yellow-400 text-black p-4 border-2 border-black 
            shadow-[6px_6px_0_rgba(0,0,0,1)]">
            Add New Course
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="title"
              placeholder="Course Title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 border-4 border-black 
                bg-white font-mono text-lg 
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            
            <textarea
              name="description"
              placeholder="Course Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full p-3 border-4 border-black 
                bg-white font-mono text-lg min-h-[120px]
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            
            <input
              name="duration"
              placeholder="Duration (e.g., 8 weeks)"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="w-full p-3 border-4 border-black 
                bg-white font-mono text-lg 
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            
            <input
              name="instructor"
              placeholder="Instructor Name"
              value={formData.instructor}
              onChange={handleInputChange}
              required
              className="w-full p-3 border-4 border-black 
                bg-white font-mono text-lg 
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            
            {error && (
              <p className="text-white bg-red-600 border-2 border-black 
                p-2 text-center font-bold uppercase">
                {error}
              </p>
            )}
            
            <button 
              type="submit" 
              className="w-full py-4 text-lg font-bold uppercase 
                bg-green-400 text-black border-4 border-black 
                shadow-[6px_6px_0_rgba(0,0,0,1)] 
                hover:bg-green-500 
                active:translate-x-[2px] active:translate-y-[2px] 
                active:shadow-[4px_4px_0_rgba(0,0,0,1)] 
                transition-all duration-200"
            >
              Add Course
            </button>
          </form>
        </div>

        <div className="border-4 border-black p-8 
          shadow-[8px_8px_0_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-bold uppercase mb-6 
            bg-blue-400 text-black p-4 border-2 border-black 
            shadow-[6px_6px_0_rgba(0,0,0,1)]">
            Existing Courses
          </h2>
          
          <div className="space-y-6">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="p-6 border-4 border-black bg-white 
                  flex justify-between items-center 
                  shadow-[6px_6px_0_rgba(0,0,0,1)] 
                  hover:translate-x-[-4px] hover:translate-y-[-4px]
                  transition-transform duration-200"
              >
                <div className="flex-grow pr-4">
                  <h3 className="text-2xl font-bold uppercase mb-2">
                    {course.title}
                  </h3>
                  <p className="font-mono text-sm mb-1">
                    {course.description}
                  </p>
                  <p className="font-mono text-sm">
                    Duration: {course.duration}
                  </p>
                  <p className="font-mono text-sm">
                    Instructor: {course.instructor}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleDelete(course._id)}
                  className="bg-red-400 text-black border-4 border-black 
                    px-4 py-2 font-bold uppercase 
                    shadow-[4px_4px_0_rgba(0,0,0,1)]
                    hover:bg-red-500 
                    active:translate-x-[2px] active:translate-y-[2px]
                    active:shadow-[2px_2px_0_rgba(0,0,0,1)]
                    transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;