'use client'
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
}

// Course Catalog Component
export const CourseCatalog = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const { toast } = useToast();

  // Fetch courses and enrolled courses logic remains the same as previous implementation
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
      const enrolledIds = data.enrolledCourses.map((course: Course) => course._id);
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

  // Enroll handler remains the same as previous implementation
  const handleEnroll = async (courseId: string) => {
    // ... (previous implementation)
  };

  // Filtering logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDuration = !selectedDuration || course.duration === selectedDuration;
    
    return matchesSearch && matchesDuration;
  });

  // Get unique durations for filter dropdown
  const availableDurations = [...new Set(courses.map(course => course.duration))];

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
      
      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search courses by title, instructor, or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-3 border-4 border-black 
            font-mono text-lg 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <select 
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
          className="p-3 border-4 border-black 
            font-mono text-lg 
            bg-white 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All Durations</option>
          {availableDurations.map(duration => (
            <option key={duration} value={duration}>
              {duration}
            </option>
          ))}
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center text-2xl font-mono 
            bg-blue-100 p-6 border-4 border-black 
            shadow-[8px_8px_0_rgba(0,0,0,1)]">
            No courses found matching your search criteria.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white border-4 border-black p-6 
                shadow-[8px_8px_0_rgba(0,0,0,1)] 
                transition-transform duration-200 
                hover:translate-x-[-4px] hover:translate-y-[-4px] 
                hover:shadow-[12px_12px_0_rgba(0,0,0,1)]"
            >
              {/* Course card remains the same as previous implementation */}
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
          ))
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;