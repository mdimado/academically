'use client'
import CourseManagement from '@/components/CourseManagement';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || role !== 'admin') {
      router.push('/');
    }
  }, [router]);

  return <CourseManagement />;
}