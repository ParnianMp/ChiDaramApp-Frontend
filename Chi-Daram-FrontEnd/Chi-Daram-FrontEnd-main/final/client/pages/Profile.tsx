import { useState } from 'react';
import { User, Mail, Phone, Calendar, Edit2, LogOut, Save, X } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  if (!user) return null;

  const handleSave = () => {
    // In a real app, this would update the user data via API
    // For now, just update localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">پروفایل کا��بری</h1>
          <p className="text-gray-600">مدیریت اطلاعات حساب کاربری</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-blue-100">{user.role === 'admin' ? 'مدیر سیستم' : 'کاربر'}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">اطلاعات شخصی</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>ویرایش</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>ذخیره</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>لغو</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user.phone}</span>
                  </div>
                )}
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ عضویت</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{user.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">امنیت حساب</h3>
          
          <div className="space-y-4">
            <button className="w-full text-right px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              تغییر رمز عبور
            </button>
            
            <button className="w-full text-right px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              فعال‌سازی تأیید دو مرحله‌ای
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">خروج از حساب</h3>
          <p className="text-gray-600 mb-4">
            با خروج از حساب کاربری، تمام اطلاعات محلی پاک خواهد شد و باید مجدداً وارد شوید.
          </p>
          
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب</span>
          </button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowLogoutModal(false)} />
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">تأیید خروج</h3>
              
              <p className="text-gray-600 mb-6">
                آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  بله، خروج
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  لغو
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
