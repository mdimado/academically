'use client'
import CourseCatalog from '@/components/CourseCatalog';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Courses() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  return <CourseCatalog />;
}