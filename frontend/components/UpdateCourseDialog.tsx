'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const UpdateCourseDialog = ({ course, onUpdate }) => {
  const [updatedCourse, setUpdatedCourse] = useState({
    title: course.title,
    description: course.description,
    duration: course.duration,
    instructor: course.instructor
  });

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
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Course Title"
              value={updatedCourse.title}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div>
            <Textarea
              name="description"
              placeholder="Course Description"
              value={updatedCourse.description}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div>
            <Input
              name="duration"
              placeholder="Duration"
              value={updatedCourse.duration}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div>
            <Input
              name="instructor"
              placeholder="Instructor Name"
              value={updatedCourse.instructor}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <Button type="submit">Update Course</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCourseDialog;