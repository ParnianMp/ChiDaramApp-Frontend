import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Home, Building, Users } from 'lucide-react';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { Location } from '../types';

export default function Locations() {
  const { locations, addLocation, updateLocation, deleteLocation } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    type: 'home' as 'home' | 'work' | 'other',
    description: '',
  });

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address) {
      return;
    }

    addLocation(newLocation);
    setNewLocation({
      name: '',
      address: '',
      type: 'home',
      description: '',
    });
    setShowAddModal(false);
  };

  const handleEditLocation = () => {
    if (!editingLocation || !newLocation.name || !newLocation.address) {
      return;
    }

    updateLocation(editingLocation.id, newLocation);
    setEditingLocation(null);
    setNewLocation({
      name: '',
      address: '',
      type: 'home',
      description: '',
    });
  };

  const openEditModal = (location: Location) => {
    setEditingLocation(location);
    setNewLocation({
      name: location.name,
      address: location.address,
      type: location.type,
      description: location.description || '',
    });
  };

  const getLocationTypeIcon = (type: Location['type']) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'work':
        return <Building className="w-5 h-5 text-green-600" />;
      case 'other':
        return <MapPin className="w-5 h-5 text-gray-600" />;
    }
  };

  const getLocationTypeText = (type: Location['type']) => {
    switch (type) {
      case 'home':
        return 'خانه';
      case 'work':
        return 'محل کار';
      case 'other':
        return 'سایر';
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingLocation(null);
    setNewLocation({
      name: '',
      address: '',
      type: 'home',
      description: '',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">محل‌های من</h1>
            <p className="text-gray-600">مدیریت آدرس‌ها و مکان‌های مورد استفاده</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>افزودن محل</span>
          </button>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getLocationTypeIcon(location.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{location.name}</h3>
                    <span className="text-sm text-gray-500">{getLocationTypeText(location.type)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(location)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteLocation(location.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-700 text-sm leading-relaxed">{location.address}</p>
                  </div>
                </div>

                {location.description && (
                  <div>
                    <p className="text-gray-600 text-sm">{location.description}</p>
                  </div>
                )}

                <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  افزوده شده: {location.dateAdded}
                </div>
              </div>
            </div>
          ))}

          {locations.length === 0 && (
            <div className="col-span-full text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">هیچ محلی ثبت نشده است</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                افزودن اولین محل
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Location Modal */}
        {(showAddModal || editingLocation) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingLocation ? 'ویرایش محل' : 'افزودن محل جدید'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام محل</label>
                  <input
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: خانه، دفتر کار"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع محل</label>
                  <select
                    value={newLocation.type}
                    onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="home">خانه</option>
                    <option value="work">محل کار</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
                  <textarea
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="آدرس کامل محل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات (اختیاری)</label>
                  <textarea
                    value={newLocation.description}
                    onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="توضیحات اضافی"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={editingLocation ? handleEditLocation : handleAddLocation}
                  disabled={!newLocation.name || !newLocation.address}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingLocation ? 'ذخیره تغییرات' : 'افزودن'}
                </button>
                <button
                  onClick={closeModal}
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
