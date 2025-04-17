'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react';

export default function SideBar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      href: '/Dashboard/Overview',
    },
    {
      title: 'Users',
      icon: Users,
      href: '/Dashboard/UserList',
    },
    {
      title: 'Products',
      icon: Package,
      href: '/Dashboard/produclist',
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      href: '/Dashboard/Orders',
    },
    {
      title: 'Users',
      icon: Users,
      href: '/Dashboard/UserList',
    },
    {
      title: 'calendar',
      icon: LayoutDashboard,
      href: '/Dashboard/Calendar',
    },
    {
      title: 'Inentory',
      icon: Package,
      href: '/Dashboard/inventory',
    },
  ];

  return (
    <div className="h-full p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">TheVault</h1>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                isActive 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
