import { Search, Menu, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MobileNavigation from './MobileNavigation';

export default function Header() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Right Side (RTL) */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">چ</span>
            </div>
            <div>
            <h1 className="text-blue-600 font-bold text-lg">چی دارم؟</h1>
            <p className="text-xs text-gray-500">سامانه مدیریت وسایل</p>
          </div>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="جستجو"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>
          </div>

          {/* Auth Section - Left Side (RTL) */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* User Name */}
          <div className="hidden lg:block text-gray-700">
            <span className="font-medium">{user?.name || 'کاربر'}</span>
          </div>

            {/* Mobile User Icon */}
            <button className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}
