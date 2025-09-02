import {
  Home,
  FileText,
  Package,
  Settings,
  ShoppingBag,
  Shield,
  Users,
  LogOut,
  MapPin
} from 'lucide-react';
import { NavigationItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

const navigationItems: NavigationItem[] = [
  { id: '1', title: 'داشبورد', icon: Home, href: '/', color: 'text-blue-600' },
  { id: '2', title: 'آیتم ه��', icon: Package, href: '/items', color: 'text-green-600' },
  { id: '3', title: 'دسته بندی ها', icon: Settings, href: '/categories', color: 'text-purple-600' },
  { id: '4', title: 'محل های من', icon: MapPin, href: '/locations', color: 'text-teal-600' },
  { id: '5', title: 'امانات', icon: Users, href: '/loans', color: 'text-orange-600' },
  { id: '6', title: 'گزارش ها', icon: FileText, href: '/reports', color: 'text-red-600' },
  { id: '7', title: 'لیست خرید', icon: ShoppingBag, href: '/purchases', color: 'text-indigo-600' },
  { id: '8', title: 'پروفایل', icon: Shield, href: '/profile', color: 'text-gray-600' },
];

export default function RightSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-l border-gray-200 min-h-screen">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name || 'کاربر'}</h3>
            <p className="text-sm text-gray-500">{user?.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
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

      {/* Logout Button */}
      <div className="absolute bottom-6 right-4 left-4">
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">خروج</span>
        </button>
      </div>
    </aside>
  );
}
