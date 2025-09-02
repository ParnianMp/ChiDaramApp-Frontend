import { useState } from 'react';
import { Plus, Eye, Edit2, Trash2, Package } from 'lucide-react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { Category, Item } from '../types';

export default function Categories() {
  const { categories, items, addCategory } = useData();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    title: '',
    description: '',
    image: '',
  });

  const getCategoryItems = (categoryId: string): Item[] => {
    return items.filter(item => item.categoryId === categoryId);
  };

  const getCategoryStats = (categoryId: string) => {
    const items = getCategoryItems(categoryId);
    return {
      totalItems: items.length,
      availableItems: items.filter(item => !item.isOutOfStock && !item.isOnLoan).length,
      outOfStockItems: items.filter(item => item.isOutOfStock).length,
      loanedItems: items.filter(item => item.isOnLoan).length,
    };
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDetailsModal(true);
  };

  const handleAddCategory = () => {
    if (!newCategory.title) {
      return;
    }

    addCategory({
      title: newCategory.title,
      description: newCategory.description,
      image: newCategory.image || 'https://images.unsplash.com/photo-1586880244386-8b3c109bb5cb?w=400&h=200&fit=crop',
      slug: newCategory.title.toLowerCase().replace(/\s+/g, '-'),
      views: 0,
      isActive: true,
    });

    setNewCategory({
      title: '',
      description: '',
      image: '',
    });
    setShowAddModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">دسته‌بندی‌ها</h1>
            <p className="text-gray-600">مدیریت و مشاهده دسته‌بندی‌های سیستم</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>افزودن دسته‌بندی</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => {
            const stats = getCategoryStats(category.id);
            return (
              <div
                key={category.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Category Image */}
                <div className="mb-4">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Category Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{category.title}</h3>

                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">کل آیتم‌ها:</span>
                      <span className="font-medium text-gray-900">{stats.totalItems}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">موجود:</span>
                      <span className="font-medium text-green-600">{stats.availableItems}</span>
                    </div>
                    {stats.outOfStockItems > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">اتمام موجودی:</span>
                        <span className="font-medium text-red-600">{stats.outOfStockItems}</span>
                      </div>
                    )}
                    {stats.loanedItems > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">امانت:</span>
                        <span className="font-medium text-orange-600">{stats.loanedItems}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400">
                    {category.views.toLocaleString('fa-IR')} بازدید
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>مشاهده</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">افزودن دسته‌بندی جدید</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
                  <input
                    type="text"
                    value={newCategory.title}
                    onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="نام دسته‌بندی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="توضیحات اختیاری"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">آدرس تصویر (اختیاری)</label>
                  <input
                    type="url"
                    value={newCategory.image}
                    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.title}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  افزودن
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCategory({ title: '', description: '', image: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  لغو
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Details Modal */}
        {showDetailsModal && selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailsModal(false)} />
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 relative z-10 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                جزئیات دسته‌بندی: {selectedCategory.title}
              </h3>

              {/* Category Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {(() => {
                  const stats = getCategoryStats(selectedCategory.id);
                  return (
                    <>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
                        <div className="text-xs text-blue-600">کل آیتم‌ها</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.availableItems}</div>
                        <div className="text-xs text-green-600">موجود</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</div>
                        <div className="text-xs text-red-600">ناموجود</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{stats.loanedItems}</div>
                        <div className="text-xs text-orange-600">امانت</div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">آیتم‌های این دسته‌بندی</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getCategoryItems(selectedCategory.id).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.isOnLoan && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">امانت</span>
                        )}
                        {item.isOutOfStock && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">ناموجود</span>
                        )}
                        {!item.isOnLoan && !item.isOutOfStock && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">موجود</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {getCategoryItems(selectedCategory.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      هیچ آیتمی در این دسته‌بندی موجود نیست
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
