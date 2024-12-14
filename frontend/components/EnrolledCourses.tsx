'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
}

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:3001/users/enrolled-courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }

        const data = await response.json();
        setEnrolledCourses(data.enrolledCourses);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="animate-pulse text-2xl font-bold uppercase 
          bg-yellow-400 text-black p-4 border-2 border-black">
          Loading Enrolled Courses...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-2xl font-bold uppercase 
          bg-red-500 text-white p-4 border-2 border-black">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-8 uppercase text-center 
        bg-yellow-400 text-black p-4 border-2 border-black 
        shadow-[6px_6px_0_rgba(0,0,0,1)]">
        My Enrolled Courses
      </h1>

      {enrolledCourses.length === 0 ? (
        <div className="text-center text-2xl font-mono 
          bg-blue-100 p-6 border-4 border-black 
          shadow-[8px_8px_0_rgba(0,0,0,1)]">
          You are not enrolled in any courses yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
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
                  className="w-full py-3 text-lg font-bold uppercase 
                    bg-yellow-400 text-black border-4 border-black 
                    shadow-[6px_6px_0_rgba(0,0,0,1)] 
                    hover:bg-yellow-500 
                    active:translate-x-[2px] active:translate-y-[2px] 
                    active:shadow-[4px_4px_0_rgba(0,0,0,1)] 
                    transition-all duration-200"
                  onClick={() => {
                    // Future: Add functionality like view course details, 
                    // access course materials, etc.
                    console.log(`View details for course: ${course.title}`);
                  }}
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;