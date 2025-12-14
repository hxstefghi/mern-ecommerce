import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';

export default function Coupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expirationDate: '',
    isActive: true
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCoupons();
    }
  }, [user]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/coupons');
      setCoupons(data);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon._id}`, formData);
        toast.success('Coupon updated successfully');
      } else {
        await api.post('/coupons', formData);
        toast.success('Coupon created successfully');
      }
      setShowModal(false);
      setEditingCoupon(null);
      setFormData({ code: '', discount: '', expirationDate: '', isActive: true });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      expirationDate: new Date(coupon.expirationDate).toISOString().split('T')[0],
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await api.put(`/coupons/${coupon._id}`, {
        ...coupon,
        isActive: !coupon.isActive
      });
      toast.success('Coupon status updated');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to update coupon');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 font-light">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-light text-gray-900 dark:text-white">COUPONS</h1>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setFormData({ code: '', discount: '', expirationDate: '', isActive: true });
              setShowModal(true);
            }}
            className="px-6 py-2 bg-gray-900 dark:bg-gray-800 text-white font-light text-sm hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
          >
            CREATE COUPON
          </button>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-light text-gray-900 dark:text-white mb-1">{coupon.code}</h3>
                  <p className="text-2xl font-light text-gray-900 dark:text-white">{coupon.discount}% OFF</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 ${
                    coupon.isActive ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 font-light space-y-1">
                <p>Expires: {new Date(coupon.expirationDate).toLocaleDateString()}</p>
                {new Date(coupon.expirationDate) < new Date() && (
                  <p className="text-red-500 dark:text-red-400">EXPIRED</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="flex-1 px-4 py-2 border border-gray-900 text-gray-900 font-light text-sm hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(coupon)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-light text-sm hover:bg-gray-50"
                >
                  {coupon.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="px-4 py-2 border border-red-500 text-red-500 font-light text-sm hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-12 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <p className="text-gray-400 dark:text-gray-500 font-light">No coupons yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 max-w-md w-full p-8">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-6">
              {editingCoupon ? 'EDIT COUPON' : 'CREATE COUPON'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-light tracking-wide">
                  COUPON CODE
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-4 py-3 font-light text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
                  placeholder="SAVE20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-light tracking-wide">
                  DISCOUNT (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-4 py-3 font-light text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
                  placeholder="20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-light tracking-wide">
                  EXPIRATION DATE
                </label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-4 py-3 font-light text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-light text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCoupon(null);
                    setFormData({ code: '', discount: '', expirationDate: '', isActive: true });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-light text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white font-light text-sm hover:bg-gray-800 dark:hover:bg-gray-700"
                >
                  {editingCoupon ? 'UPDATE' : 'CREATE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
