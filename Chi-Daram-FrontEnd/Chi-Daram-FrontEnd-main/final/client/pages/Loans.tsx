import { useState } from 'react';
import { Search, Plus, Users, Calendar, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { Loan } from '../types';

export default function Loans() {
  const { loans, items, addLoan, returnLoan } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'returned'>('all');
  const [newLoan, setNewLoan] = useState({
    itemId: '',
    recipientName: '',
    recipientContact: '',
    notes: '',
  });

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && !loan.isReturned) ||
                         (filterStatus === 'returned' && loan.isReturned);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (loan: Loan) => {
    if (loan.isReturned) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          <CheckCircle className="w-3 h-3" />
          بازگردانده شده
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
        <AlertCircle className="w-3 h-3" />
        در دست امانت‌گیرنده
      </span>
    );
  };

  const handleAddLoan = () => {
    if (!newLoan.itemId || !newLoan.recipientName) {
      return;
    }

    const selectedItem = items.find(item => item.id === newLoan.itemId);
    if (!selectedItem) return;

    addLoan({
      itemId: newLoan.itemId,
      itemName: selectedItem.name,
      category: selectedItem.category,
      recipientName: newLoan.recipientName,
      recipientContact: newLoan.recipientContact,
      notes: newLoan.notes,
    });

    setNewLoan({
      itemId: '',
      recipientName: '',
      recipientContact: '',
      notes: '',
    });
    setShowAddModal(false);
  };

  const handleReturnLoan = (loanId: string) => {
    returnLoan(loanId);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">امانات</h1>
            <p className="text-gray-600">مدیریت و پیگیری آیتم‌های امانت داده شده</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>ثبت امانت جدید</span>
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
                  placeholder="جستجو در امانات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-64">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">همه امانات</option>
                <option value="active">فعال</option>
                <option value="returned">بازگردانده شده</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loans List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">نام آیتم</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">دسته‌بندی</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">دریافت‌کننده</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">تاریخ امانت</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">وضعیت</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{loan.itemName}</div>
                      {loan.notes && (
                        <div className="text-sm text-gray-500 mt-1">{loan.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-600 font-medium">{loan.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{loan.recipientName}</div>
                          {loan.recipientContact && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {loan.recipientContact}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        {loan.loanDate}
                      </div>
                      {loan.returnDate && (
                        <div className="text-sm text-green-600 mt-1">
                          بازگشت: {loan.returnDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(loan)}
                    </td>
                    <td className="px-6 py-4">
                      {!loan.isReturned && (
                        <button
                          onClick={() => handleReturnLoan(loan.id)}
                          className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                        >
                          بازگرداندن
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLoans.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              {loans.length === 0 ? (
                <div>
                  <p className="text-gray-500 mb-2">هیچ امانتی ثبت نشده است</p>
                  <p className="text-gray-400 text-sm mb-6">وقتی آیتمی امانت دهید، اینجا نمایش داده می‌شود</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ثبت اولین امانت
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">هیچ امانتی با این فیلتر یافت نشد</p>
              )}
            </div>
          )}
        </div>

        {/* Add Loan Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ثبت امانت جدید</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب آیتم</label>
                  <select
                    value={newLoan.itemId}
                    onChange={(e) => setNewLoan({ ...newLoan, itemId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب آیتم</option>
                    {items.filter(item => !item.isOnLoan && !item.isOutOfStock).map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  {items.filter(item => !item.isOnLoan && !item.isOutOfStock).length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">هیچ آیتم موجودی برای امانت یافت نشد</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام دریافت‌کننده</label>
                  <input
                    type="text"
                    value={newLoan.recipientName}
                    onChange={(e) => setNewLoan({ ...newLoan, recipientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="نام و نام خانوادگی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">شماره تماس (اختیاری)</label>
                  <input
                    type="tel"
                    value={newLoan.recipientContact}
                    onChange={(e) => setNewLoan({ ...newLoan, recipientContact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="09123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت (اختیاری)</label>
                  <textarea
                    value={newLoan.notes}
                    onChange={(e) => setNewLoan({ ...newLoan, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="یادداشت اختیاری"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddLoan}
                  disabled={!newLoan.itemId || !newLoan.recipientName}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ثبت امانت
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewLoan({ itemId: '', recipientName: '', recipientContact: '', notes: '' });
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
