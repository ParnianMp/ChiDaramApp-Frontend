import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, ShoppingCart, AlertCircle, Star } from 'lucide-react';
import Layout from '../components/Layout';
import { mockPurchaseItems } from '../data/mockData';
import { PurchaseItem } from '../types';

export default function Purchases() {
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(mockPurchaseItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PurchaseItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'purchased'>('all');

  const filteredItems = purchaseItems.filter(item => {
    if (filter === 'pending') return !item.isPurchased;
    if (filter === 'purchased') return item.isPurchased;
    return true;
  });

  const getPriorityBadge = (priority: PurchaseItem['priority']) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
            <AlertCircle className="w-3 h-3" />
            فوری
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            <Star className="w-3 h-3" />
            متوسط
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            <Check className="w-3 h-3" />
            کم
          </span>
        );
    }
  };

  const getStatusBadge = (item: PurchaseItem) => {
    if (item.isPurchased) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          <Check className="w-3 h-3" />
          خریداری شده
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
        <ShoppingCart className="w-3 h-3" />
        در انتظار خرید
      </span>
    );
  };

  const togglePurchased = (id: string) => {
    setPurchaseItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, isPurchased: !item.isPurchased, datePurchased: !item.isPurchased ? new Date().toLocaleDateString('fa-IR') : undefined }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setPurchaseItems(items => items.filter(item => item.id !== id));
  };

  const getTotalEstimatedCost = () => {
    return filteredItems
      .filter(item => !item.isPurchased && item.estimatedPrice)
      .reduce((total, item) => total + (item.estimatedPrice || 0), 0);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">لیست خرید</h1>
            <p className="text-gray-600">نوشتن و مدیریت لیست خریدهای مورد نیاز</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>نوشتن لیست خرید</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">کل آیتم‌ها</p>
                <p className="text-2xl font-bold text-gray-900">{purchaseItems.length.toLocaleString('fa-IR')}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">در انتظار خرید</p>
                <p className="text-2xl font-bold text-orange-600">
                  {purchaseItems.filter(item => !item.isPurchased).length.toLocaleString('fa-IR')}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">برآورد هزینه</p>
                <p className="text-2xl font-bold text-green-600">
                  {getTotalEstimatedCost().toLocaleString('fa-IR')} تومان
                </p>
              </div>
              <Star className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              همه ({purchaseItems.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              در انتظار ({purchaseItems.filter(item => !item.isPurchased).length})
            </button>
            <button
              onClick={() => setFilter('purchased')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'purchased' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              خریداری شده ({purchaseItems.filter(item => item.isPurchased).length})
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">نام آیتم</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">اولویت</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">قیمت تخمینی</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">وضعیت</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">تاریخ افزودن</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${item.isPurchased ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`font-medium ${item.isPurchased ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.name}
                        </div>
                        {item.category && (
                          <div className="text-sm text-blue-600 mt-1">{item.category}</div>
                        )}
                        {item.notes && (
                          <div className="text-sm text-gray-500 mt-1">{item.notes}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(item.priority)}
                    </td>
                    <td className="px-6 py-4">
                      {item.estimatedPrice ? (
                        <span className="text-gray-900 font-medium">
                          {item.estimatedPrice.toLocaleString('fa-IR')} تومان
                        </span>
                      ) : (
                        <span className="text-gray-400">نامشخص</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item)}
                      {item.datePurchased && (
                        <div className="text-xs text-gray-500 mt-1">
                          خرید: {item.datePurchased}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {item.dateAdded}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePurchased(item.id)}
                          className={`p-1 rounded transition-colors ${
                            item.isPurchased
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={item.isPurchased ? 'برگرداندن به لیست' : 'علامت‌گذاری به عنوان خریداری شده'}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="ویرایش"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              {purchaseItems.length === 0 ? (
                <div>
                  <p className="text-gray-500 mb-2">لیست خرید خالی است</p>
                  <p className="text-gray-400 text-sm mb-6">آیتم‌هایی که نیاز به خرید دارید اینجا اضافه کنید</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    نوشتن اولین آیتم
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">هیچ آیتمی با این فیلتر یافت نشد</p>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || editingItem) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => {
              setShowAddModal(false);
              setEditingItem(null);
            }} />
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام آیتم</label>
                  <input
                    type="text"
                    defaultValue={editingItem?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="نام آیتم مورد نیاز"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                  <select
                    defaultValue={editingItem?.category || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    <option value="لوازم دیجیتال">لوازم دیجیتال</option>
                    <option value="پوشاک">پوشاک</option>
                    <option value="لوازم ورزشی">لوازم ورزشی</option>
                    <option value="لوازم خانگی">لوازم خانگی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                  <select
                    defaultValue={editingItem?.priority || 'medium'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">فوری</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">قیمت تخمینی (تومان)</label>
                  <input
                    type="number"
                    defaultValue={editingItem?.estimatedPrice || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="قیمت تخمینی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت</label>
                  <textarea
                    defaultValue={editingItem?.notes || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="یادداشت اختیاری"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {editingItem ? 'ذخیره تغییرات' : 'افزودن'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
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
