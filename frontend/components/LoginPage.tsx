'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        
        if (data.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/courses');
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border-4 border-black bg-white p-8 
        shadow-[8px_8px_0_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-bold mb-8 uppercase text-center 
          bg-yellow-400 text-black p-4 border-2 border-black 
          shadow-[6px_6px_0_rgba(0,0,0,1)]">
          Login
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleInputChange}
              className="w-full p-3 border-4 border-black 
                bg-white font-mono text-lg 
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full p-3 border-4 border-black 
                bg-white font-mono text-lg 
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

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
            Login
          </button>

          <p className="text-center text-sm uppercase font-mono">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-blue-600 underline 
                hover:bg-blue-200 hover:px-1 
                border-b-2 border-black"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;