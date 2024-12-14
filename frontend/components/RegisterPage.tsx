'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeTab === 'admin' && { 'Admin-Secret-Key': formData.adminKey })
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: activeTab
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border-4 border-black bg-white p-8 
        shadow-[8px_8px_0_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-bold mb-8 uppercase text-center 
          bg-yellow-400 text-black p-4 border-2 border-black 
          shadow-[6px_6px_0_rgba(0,0,0,1)]">
          Register
        </h1>

        <div className="flex border-4 border-black mb-6">
          <button 
            onClick={() => handleTabChange('user')}
            className={`w-1/2 py-3 uppercase font-bold border-r-4 border-black
              ${activeTab === 'user' 
                ? 'bg-green-400 text-black' 
                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            User
          </button>
          <button 
            onClick={() => handleTabChange('admin')}
            className={`w-1/2 py-3 uppercase font-bold 
              ${activeTab === 'admin' 
                ? 'bg-pink-400 text-black' 
                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border-4 border-black 
                bg-white font-mono text-lg 
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              minLength={6}
            />
          </div>
          
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-3 border-4 border-black 
                bg-white font-mono text-lg 
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              minLength={6}
            />
          </div>
          
          {activeTab === 'admin' && (
            <div>
              <input
                type="password"
                name="adminKey"
                placeholder="Admin Secret Key"
                value={formData.adminKey}
                onChange={handleInputChange}
                className="w-full p-3 border-4 border-black 
                  bg-white font-mono text-lg 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
          )}
          
          {error && (
            <p className="text-white bg-red-600 border-2 border-black 
              p-2 text-center font-bold uppercase">
              {error}
            </p>
          )}
          
          <button 
            type="submit" 
            className="w-full py-4 text-lg font-bold uppercase 
              bg-blue-400 text-black border-4 border-black 
              shadow-[6px_6px_0_rgba(0,0,0,1)] 
              hover:bg-blue-500 
              active:translate-x-[2px] active:translate-y-[2px] 
              active:shadow-[4px_4px_0_rgba(0,0,0,1)] 
              transition-all duration-200"
          >
            Register as {activeTab === 'admin' ? 'Admin' : 'User'}
          </button>

          <p className="text-center text-sm uppercase font-mono">
            Already have an account?{' '}
            <Link 
              href="/" 
              className="text-blue-600 underline 
                hover:bg-blue-200 hover:px-1 
                border-b-2 border-black"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;