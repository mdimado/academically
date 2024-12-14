'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnrolledCourses from '../../components/EnrolledCourses';

export default function Courses() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  return <EnrolledCourses />;
}