import { useState } from 'react';
import { Plus, Package, AlertTriangle, Users, TrendingUp, Calendar, Eye } from 'lucide-react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { Activity } from '../types';

export default function Dashboard() {
  const { getDashboardStats, addItem, categories, locations } = useData();
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    categoryId: '',
    locationId: '',
    description: '',
  });

  const stats = getDashboardStats();

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'add_item':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'delete_item':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'loan_item':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'return_item':
        return <Package className="w-4 h-4 text-purple-600" />;
      case 'add_category':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityTypeText = (type: Activity['type']) => {
    switch (type) {
      case 'add_item':
        return 'افزودن آیتم';
      case 'delete_item':
        return 'حذف آیتم';
      case 'loan_item':
        return 'امانت دادن';
      case 'return_item':
        return 'بازگرداندن';
      case 'add_category':
        return 'افزودن دسته‌بندی';
      default:
        return 'فعالیت';
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.categoryId) {
      return;
    }

    const selectedCategory = categories.find(cat => cat.id === newItem.categoryId);
    const selectedLocation = newItem.locationId ? locations.find(loc => loc.id === newItem.locationId) : null;
    if (!selectedCategory) return;

    addItem({
      name: newItem.name,
      category: selectedCategory.title,
      categoryId: newItem.categoryId,
      locationId: newItem.locationId || undefined,
      location: selectedLocation ? selectedLocation.name : undefined,
      description: newItem.description,
      isOutOfStock: false,
      isOnLoan: false,
    });

    setNewItem({
      name: '',
      category: '',
      categoryId: '',
      locationId: '',
      description: '',
    });
    setShowAddItemModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">داشبورد</h1>
            <p className="text-gray-600">مدیریت و نظارت بر فعالیت‌های سیستم</p>
          </div>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>افزودن آیتم</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">کل آیتم‌ها</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems.toLocaleString('fa-IR')}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">از رده خارج</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems.toLocaleString('fa-IR')}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Loaned Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">امانات</p>
                <p className="text-2xl font-bold text-orange-600">{stats.loanedItems.toLocaleString('fa-IR')}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Total Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">دسته‌بندی‌ها</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalCategories.toLocaleString('fa-IR')}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">فعالیت‌های اخیر</h2>
            {stats.recentActivities.length > 0 && (
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-sm">مشاهده همه</span>
              </button>
            )}
          </div>

          {stats.recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">هیچ فعالیتی ثبت نشده است</p>
              <p className="text-gray-400 text-sm">وقتی آیتم، دسته‌بندی یا امانت جدیدی اضافه کنید، اینجا نمایش داده می‌شود</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{getActivityTypeText(activity.type)}</span>
                      {activity.itemName && (
                        <>
                          <span className="text-gray-500">-</span>
                          <span className="text-gray-700">{activity.itemName}</span>
                        </>
                      )}
                      {activity.categoryName && (
                        <>
                          <span className="text-gray-500">-</span>
                          <span className="text-blue-600">{activity.categoryName}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  {activity.count && (
                    <div className="text-sm text-gray-500">
                      تعداد: {activity.count.toLocaleString('fa-IR')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Item Modal */}
        {showAddItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddItemModal(false)} />
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">افزودن آیتم جدید</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام آیتم</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="نام آیتم را وارد کنید"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                  <select
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-sm text-blue-600 mt-1">
                      <a href="/categories" className="hover:underline">ابتدا دسته‌بندی ایجاد کنید</a>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">محل (اختیاری)</label>
                  <select
                    value={newItem.locationId}
                    onChange={(e) => setNewItem({ ...newItem, locationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب م��ل</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                  {locations.length === 0 && (
                    <p className="text-sm text-blue-600 mt-1">
                      <a href="/locations" className="hover:underline">ابتدا محل ایجاد کنید</a>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="توضیحات اختیاری"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.name || !newItem.categoryId}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  افزودن
                </button>
                <button
                  onClick={() => {
                    setShowAddItemModal(false);
                    setNewItem({ name: '', category: '', categoryId: '', locationId: '', description: '' });
                  }}
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
