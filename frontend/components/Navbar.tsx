'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  const updateRole = () => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  };

  useEffect(() => {
    updateRole();

    window.addEventListener('storage', updateRole);

    return () => {
      window.removeEventListener('storage', updateRole);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    window.dispatchEvent(new Event('storage'));
    
    router.push('/');
  };

  if (role === null) {
    return null;
  }

  return (
    <nav className="bg-white border-b-4 border-black p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href={role === 'admin' ? '/admin/dashboard' : '/courses'} 
          className="text-2xl font-bold uppercase 
            bg-yellow-400 text-black px-4 py-2 
            border-2 border-black 
            hover:bg-yellow-500 
            transition-colors duration-200"
        >
         Academically
        </Link>
        <div className="flex items-center space-x-4">
          {role === 'admin' ? (
            <>
              <Link 
                href="/admin/dashboard" 
                className="px-3 py-2 uppercase font-bold 
                  bg-green-400 text-black border-2 border-black
                  hover:bg-green-500 
                  transition-colors duration-200"
              >
                Admin Dashboard
              </Link>
              
              <button 
                onClick={handleLogout}
                className="px-3 py-2 uppercase font-bold 
                  bg-red-400 text-black border-2 border-black
                  hover:bg-red-500 
                  transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/courses" 
                className="px-3 py-2 uppercase font-bold 
                  bg-blue-400 text-black border-2 border-black
                  hover:bg-blue-500 
                  transition-colors duration-200"
              >
                Courses
              </Link>
              <Link 
                href="/enrolled" 
                className="px-3 py-2 uppercase font-bold 
                  bg-pink-400 text-black border-2 border-black
                  hover:bg-pink-500 
                  transition-colors duration-200"
              >
                My Courses
              </Link>
              <button 
                onClick={handleLogout}
                className="px-3 py-2 uppercase font-bold 
                  bg-red-400 text-black border-2 border-black
                  hover:bg-red-500 
                  transition-colors duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;