import { useState } from 'react';
import { Search, Eye, Package, AlertCircle, Users, Plus, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { Item } from '../types';

export default function Items() {
  const { items, categories, locations, addItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    categoryId: '',
    locationId: '',
    description: '',
    price: '',
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (item: Item) => {
    if (item.isOnLoan) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
          <Users className="w-3 h-3" />
          امانت
        </span>
      );
    }
    if (item.isOutOfStock) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
          <AlertCircle className="w-3 h-3" />
          اتمام موجودی
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
        <Package className="w-3 h-3" />
        موجود
      </span>
    );
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
      price: newItem.price ? parseFloat(newItem.price) : undefined,
      isOutOfStock: false,
      isOnLoan: false,
    });

    setNewItem({
      name: '',
      categoryId: '',
      locationId: '',
      description: '',
      price: '',
    });
    setShowAddModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">آیتم‌ها</h1>
            <p className="text-gray-600">مدیریت و مشاهده تمام آیتم‌های موجود</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>افزودن آیتم</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="جستجو در آیتم‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.title}>{category.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">نام آیتم</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">دسته‌بندی</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">وضعیت</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">تاریخ افزودن</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-600 font-medium">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item)}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {item.dateAdded}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">جزئیات</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              {items.length === 0 ? (
                <div>
                  <p className="text-gray-500 mb-2">هیچ آیتمی ثبت نشده است</p>
                  <p className="text-gray-400 text-sm mb-6">ابتدا آیتم‌هایتان را اضافه کنید</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    افزودن اولین آیتم
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">هیچ آیتمی با این فیلتر یافت نشد</p>
              )}
            </div>
          )}
        </div>

        {/* Item Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedItem(null)} />
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">جزئیات آیتم</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">نام آیتم</label>
                  <p className="text-gray-900 font-medium">{selectedItem.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">دسته‌بندی</label>
                  <p className="text-blue-600 font-medium">{selectedItem.category}</p>
                </div>

                {selectedItem.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">توضیحات</label>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">وضعیت</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedItem)}
                  </div>
                </div>

                {selectedItem.price && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">قیمت</label>
                    <p className="text-gray-900 font-medium">
                      {selectedItem.price.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                )}

                {selectedItem.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">مکان</label>
                    <p className="text-gray-700">{selectedItem.location}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">تاریخ افزودن</label>
                  <p className="text-gray-700">{selectedItem.dateAdded}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  بستن
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  ویرایش
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">محل (اختیاری)</label>
                  <select
                    value={newItem.locationId}
                    onChange={(e) => setNewItem({ ...newItem, locationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب محل</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="قیمت را وارد کنید"
                  />
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
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  افزودن
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewItem({ name: '', categoryId: '', locationId: '', description: '', price: '' });
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
