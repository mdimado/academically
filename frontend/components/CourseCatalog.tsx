import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCourses(), fetchEnrolledCourses()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:3001/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive"
      });
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await fetch('http://localhost:3001/users/enrolled-courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch enrolled courses');
      
      const data = await response.json();
      const enrolledIds = data.enrolledCourses.map(course => course._id);
      setEnrolledCourseIds(enrolledIds);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch enrolled courses",
        variant: "destructive"
      });
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);  // Log the token
      console.log('Enrolling in Course:', courseId);
  
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to enroll in courses",
          variant: "destructive"
        });
        return;
      }
  
      const response = await fetch(`http://localhost:3001/users/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Response Status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw Response:', responseText);
  
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        throw new Error('Invalid response from server');
      }
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to enroll');
      }
  
      setEnrolledCourseIds(prev => [...prev, courseId]);
      toast({
        title: "Success",
        description: "Successfully enrolled in course",
      });
    } catch (error) {
      console.error('Full Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-white border-4 border-black font-mono">
        <div className="animate-pulse text-2xl font-bold">Loading Courses...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white border-4 border-black">
      <h1 className="text-4xl font-bold mb-8 uppercase tracking-tight 
        bg-yellow-400 text-black p-4 border-2 border-black 
        shadow-[6px_6px_0_rgba(0,0,0,1)]">
        Available Courses
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div 
            key={course._id} 
            className="bg-white border-4 border-black p-6 
              shadow-[8px_8px_0_rgba(0,0,0,1)] 
              transition-transform duration-200 
              hover:translate-x-[-4px] hover:translate-y-[-4px] 
              hover:shadow-[12px_12px_0_rgba(0,0,0,1)]"
          >
            <h2 className="text-2xl font-bold mb-4 uppercase 
              bg-green-400 text-black p-2 border-2 border-black 
              inline-block">
              {course.title}
            </h2>
            <div className="space-y-3">
              <p className="text-lg mb-2 border-b-2 border-black pb-2">
                {course.description}
              </p>
              <p className="font-mono text-sm">
                <strong className="bg-blue-200 px-1 border-2 border-black">Duration:</strong> {course.duration}
              </p>
              <p className="font-mono text-sm">
                <strong className="bg-pink-200 px-1 border-2 border-black">Instructor:</strong> {course.instructor}
              </p>
              <button 
                onClick={() => handleEnroll(course._id)}
                disabled={enrolledCourseIds.includes(course._id)}
                className={`w-full py-3 text-lg font-bold uppercase 
                  border-4 border-black 
                  transition-all duration-200 
                  ${enrolledCourseIds.includes(course._id) 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : 'bg-yellow-400 hover:bg-yellow-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0_rgba(0,0,0,1)]'}
                  shadow-[6px_6px_0_rgba(0,0,0,1)] 
                  hover:shadow-[8px_8px_0_rgba(0,0,0,1)]`}
              >
                {enrolledCourseIds.includes(course._id) ? 'Enrolled' : 'Enroll Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCatalog;