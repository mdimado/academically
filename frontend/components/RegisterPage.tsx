'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                  minLength={6}
                />
              </div>
              
              {activeTab === 'admin' && (
                <div>
                  <Input
                    type="password"
                    name="adminKey"
                    placeholder="Admin Secret Key"
                    value={formData.adminKey}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
              )}
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Register as {activeTab === 'admin' ? 'Admin' : 'User'}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/" className="text-blue-600 hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;