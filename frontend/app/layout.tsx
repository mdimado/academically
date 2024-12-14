'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    
    if (token && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }

    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('token');
      const currentRole = localStorage.getItem('role');
      
      setIsAuthenticated(!!currentToken);
      setRole(currentRole);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {isAuthenticated && <Navbar />}
        {children}
      </body>
    </html>
  );
}