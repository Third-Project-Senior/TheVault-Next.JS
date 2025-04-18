'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import SideBar from '../Dashboard/SideBar';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        router.push('/');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      router.push('/');
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 border-r bg-white">
        <SideBar />
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
