import { useState } from 'react';
import {
  Home,
  FileText,
  Package,
  Settings,
  ShoppingBag,
  Shield,
  Users,
  LogOut,
  X,
  MapPin
} from 'lucide-react';
import { NavigationItem } from '../types';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems: NavigationItem[] = [
  { id: '1', title: 'داشبورد', icon: Home, href: '/', color: 'text-blue-600' },
  { id: '2', title: 'آیتم ها', icon: Package, href: '/items', color: 'text-green-600' },
  { id: '3', title: 'دسته بندی ها', icon: Settings, href: '/categories', color: 'text-purple-600' },
  { id: '4', title: 'محل های من', icon: MapPin, href: '/locations', color: 'text-teal-600' },
  { id: '5', title: 'امانات', icon: Users, href: '/loans', color: 'text-orange-600' },
  { id: '6', title: 'گزارش ها', icon: FileText, href: '/reports', color: 'text-red-600' },
  { id: '7', title: 'لیست خرید', icon: ShoppingBag, href: '/purchases', color: 'text-indigo-600' },
  { id: '8', title: 'پروفایل', icon: Shield, href: '/profile', color: 'text-gray-600' },
];

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Navigation Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">منو</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
              <img 
                src="/api/placeholder/48/48" 
                alt="User Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">اوژیر بهاور</h3>
              <p className="text-sm text-gray-500">۱۴۰۳/۰۹/۰۸</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  item.isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${item.color || 'text-gray-400'}`} />
                <span className="font-medium">{item.title}</span>
              </a>
            );
          })}
        </nav>

        {/* Auth & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button className="flex items-center gap-3 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full">
            <Users className="w-5 h-5" />
            <span className="font-medium">ثبت نام/ورود</span>
          </button>
          
          <button className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">خروج</span>
          </button>
        </div>
      </div>
    </div>
  );
}
