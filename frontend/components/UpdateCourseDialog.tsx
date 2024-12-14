'use client'
import React, { useState } from 'react';

const UpdateCourseDialog = ({ course, onUpdate }) => {
  const [updatedCourse, setUpdatedCourse] = useState({
    title: course.title,
    description: course.description,
    duration: course.duration,
    instructor: course.instructor
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e) => {
    setUpdatedCourse({
      ...updatedCourse,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/admin/courses/${course._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedCourse),
      });

      if (response.ok) {
        onUpdate();
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-400 text-black border-4 border-black 
          px-4 py-2 font-bold uppercase 
          shadow-[4px_4px_0_rgba(0,0,0,1)]
          hover:bg-blue-500 
          active:translate-x-[2px] active:translate-y-[2px]
          active:shadow-[2px_2px_0_rgba(0,0,0,1)]
          transition-all duration-200"
      >
        Edit Course
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 
            flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white border-4 border-black p-8 w-full max-w-md 
              shadow-[8px_8px_0_rgba(0,0,0,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold uppercase mb-6 
              bg-yellow-400 text-black p-4 border-2 border-black 
              shadow-[6px_6px_0_rgba(0,0,0,1)]">
              Update Course
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="title"
                placeholder="Course Title"
                value={updatedCourse.title}
                onChange={handleInputChange}
                className="w-full p-3 border-4 border-black 
                  bg-white font-mono text-lg 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              
              <textarea
                name="description"
                placeholder="Course Description"
                value={updatedCourse.description}
                onChange={handleInputChange}
                className="w-full p-3 border-4 border-black 
                  bg-white font-mono text-lg min-h-[120px]
                  focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              
              <input
                name="duration"
                placeholder="Duration"
                value={updatedCourse.duration}
                onChange={handleInputChange}
                className="w-full p-3 border-4 border-black 
                  bg-white font-mono text-lg 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              
              <input
                name="instructor"
                placeholder="Instructor Name"
                value={updatedCourse.instructor}
                onChange={handleInputChange}
                className="w-full p-3 border-4 border-black 
                  bg-white font-mono text-lg 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              
              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="flex-grow py-4 text-lg font-bold uppercase 
                    bg-green-400 text-black border-4 border-black 
                    shadow-[6px_6px_0_rgba(0,0,0,1)] 
                    hover:bg-green-500 
                    active:translate-x-[2px] active:translate-y-[2px] 
                    active:shadow-[4px_4px_0_rgba(0,0,0,1)] 
                    transition-all duration-200"
                >
                  Update Course
                </button>
                
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-grow py-4 text-lg font-bold uppercase 
                    bg-red-400 text-black border-4 border-black 
                    shadow-[6px_6px_0_rgba(0,0,0,1)] 
                    hover:bg-red-500 
                    active:translate-x-[2px] active:translate-y-[2px] 
                    active:shadow-[4px_4px_0_rgba(0,0,0,1)] 
                    transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCourseDialog;