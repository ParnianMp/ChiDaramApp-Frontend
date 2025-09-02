import { useState } from 'react';
import { Download, Calendar, Filter, Activity, Plus, Trash2, Edit, Users, Package } from 'lucide-react';
import Layout from '../components/Layout';
import { mockActivities } from '../data/mockData';
import { Activity as ActivityType } from '../types';

export default function Reports() {
  const [activities, setActivities] = useState<ActivityType[]>(mockActivities);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [filterType, setFilterType] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === 'all' || activity.type === filterType;
    // Add date filtering logic here if needed
    return matchesType;
  });

  const getActivityIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'add_item':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'delete_item':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'edit_item':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'loan_item':
        return <Users className="w-4 h-4 text-orange-600" />;
      case 'return_item':
        return <Package className="w-4 h-4 text-purple-600" />;
      case 'add_category':
        return <Plus className="w-4 h-4 text-indigo-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityTypeText = (type: ActivityType['type']) => {
    switch (type) {
      case 'add_item':
        return 'افزودن آیتم';
      case 'delete_item':
        return 'حذف آیتم';
      case 'edit_item':
        return 'ویرایش آیتم';
      case 'loan_item':
        return 'امانت دادن';
      case 'return_item':
        return 'بازگرداندن آیتم';
      case 'add_category':
        return 'افزودن دسته‌بندی';
      default:
        return 'فعالیت';
    }
  };

  const getActivityColor = (type: ActivityType['type']) => {
    switch (type) {
      case 'add_item':
        return 'bg-green-50 border-green-200';
      case 'delete_item':
        return 'bg-red-50 border-red-200';
      case 'edit_item':
        return 'bg-blue-50 border-blue-200';
      case 'loan_item':
        return 'bg-orange-50 border-orange-200';
      case 'return_item':
        return 'bg-purple-50 border-purple-200';
      case 'add_category':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleDownloadReport = () => {
    // Create CSV content
    const headers = ['نوع فعالیت', 'نام آیتم', 'دسته‌بندی', 'تاریخ', 'تعداد'];
    const csvContent = [
      headers.join(','),
      ...filteredActivities.map(activity => [
        getActivityTypeText(activity.type),
        activity.itemName || '',
        activity.categoryName || '',
        activity.date,
        activity.count || ''
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `گزارش-فعالیت-${new Date().toLocaleDateString('fa-IR')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">گزارش‌ها</h1>
            <p className="text-gray-600">تاریخچه فعالیت‌ها و گزارش‌گیری سیستم</p>
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>دانل��د گزارش</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">کل فعالیت‌ها</p>
                <p className="text-2xl font-bold text-gray-900">{activities.length.toLocaleString('fa-IR')}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">آیتم‌های اضافه شده</p>
                <p className="text-2xl font-bold text-green-600">
                  {activities.filter(a => a.type === 'add_item').length.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">امانات داده شده</p>
                <p className="text-2xl font-bold text-orange-600">
                  {activities.filter(a => a.type === 'loan_item').length.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">آیتم‌های حذف شده</p>
                <p className="text-2xl font-bold text-red-600">
                  {activities.filter(a => a.type === 'delete_item').length.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Activity Type Filter */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع فعالیت</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">همه فعالیت‌ها</option>
                <option value="add_item">افزودن آیتم</option>
                <option value="delete_item">حذف آیتم</option>
                <option value="edit_item">ویرایش آیتم</option>
                <option value="loan_item">امانت دادن</option>
                <option value="return_item">بازگرداندن</option>
                <option value="add_category">افزودن دسته‌بندی</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">از تاریخ</label>
                <input
                  type="text"
                  placeholder="1403/09/01"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تا تاریخ</label>
                <input
                  type="text"
                  placeholder="1403/09/08"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">تاریخچه فعالیت‌��ا</h2>
          
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${getActivityColor(activity.type)}`}
              >
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
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    {activity.date}
                  </div>
                  {activity.count && (
                    <div className="text-sm text-gray-500">
                      تعداد: {activity.count.toLocaleString('fa-IR')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              {activities.length === 0 ? (
                <div>
                  <p className="text-gray-500 mb-2">هیچ فعالیتی ثبت نشده است</p>
                  <p className="text-gray-400 text-sm mb-6">وقتی آیتم، دسته‌بندی یا امانت اضافه کنید، فعالیت‌ها اینجا نمایش داده می‌شود</p>
                </div>
              ) : (
                <p className="text-gray-500">هیچ فعالیتی در این بازه زمانی یافت نشد</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
