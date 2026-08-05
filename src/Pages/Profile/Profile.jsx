import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaTrash,
  FaCheck,
  FaWallet,
} from 'react-icons/fa';
import { useToast } from '../../components/Toaster';
import { apiFetch } from '../../config/api.js';

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function getStatusClasses(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'pending') return 'bg-amber-100 text-amber-800';
  if (s === 'processing') return 'bg-blue-100 text-blue-800';
  if (s === 'shipped') return 'bg-sky-100 text-sky-800';
  if (s === 'delivered' || s === 'completed') return 'bg-green-100 text-green-800';
  if (s === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
}

const Profile = () => {
  const { user, signOut, userId, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
      return;
    }
    fetchUserData();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (location.state?.openOrdersTab) setActiveTab('orders');
  }, [location.state?.openOrdersTab]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchAddresses(), fetchWalletBalance()]);
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await apiFetch(`/api/orders/user/${userId}`);
      const result = await response.json();
      if (result.success) setOrders(result.data || []);
    } catch (_error) {}
  };

  const fetchAddresses = async () => {
    try {
      const response = await apiFetch(`/api/addresses/user/${userId}`);
      const result = await response.json();
      if (result.success) setAddresses(result.data || []);
    } catch (_error) {}
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await apiFetch('/api/wallet/balance');
      const result = await response.json();
      if (result.success) setWalletBalance(Number(result?.data?.balance || 0));
    } catch (_error) {}
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (_error) {
      toast.error('Failed to logout');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const response = await apiFetch(`/api/addresses/${addressId}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        toast.success('Address deleted successfully');
        fetchAddresses();
      } else {
        toast.error(result.message || 'Failed to delete address');
      }
    } catch (_error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await apiFetch(`/api/addresses/${addressId}/default`, {
        method: 'PATCH',
        body: JSON.stringify({}),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Default address updated');
        fetchAddresses();
      } else {
        toast.error(result.message || 'Failed to update default address');
      }
    } catch (_error) {
      toast.error('Failed to update default address');
    }
  };

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const displayName = user?.full_name?.trim() || 'Member';
  const currentOrders = orders.filter((o) =>
    ['pending', 'processing', 'shipped'].includes(o.order_status?.toLowerCase()),
  );
  const previousOrders = orders.filter((o) =>
    ['delivered', 'cancelled', 'completed'].includes(o.order_status?.toLowerCase()),
  );

  const OrderCard = ({ order, primaryAction }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-bold text-gray-900">Order #{order.order_number}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.created_at).toLocaleDateString('en-IN')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusClasses(order.order_status)}`}>
          {order.order_status}
        </span>
      </div>
      {order.order_items?.length > 0 && (
        <ul className="text-sm text-gray-600 space-y-1 mb-4">
          {order.order_items.map((item, idx) => (
            <li key={idx}>
              {item.product_name} × {item.quantity} — {formatCurrency(item.subtotal)}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <p className="font-bold text-gray-900">Total: {formatCurrency(order.final_amount)}</p>
        <button
          onClick={() => navigate(`/orders/${order.id}`)}
          className={primaryAction
            ? 'px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90'
            : 'text-primary font-semibold text-sm hover:underline'}
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50/40 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FaUser className="text-2xl text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                <p className="text-gray-600 mt-1">
                  {user?.phone_number ? `+91 ${user.phone_number}` : ''}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {orders.length} orders · {addresses.length} addresses · Wallet {formatCurrency(walletBalance)}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: FaUser },
              { id: 'orders', label: `Orders (${orders.length})`, icon: FaShoppingBag },
              { id: 'addresses', label: `Addresses (${addresses.length})`, icon: FaMapMarkerAlt },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 px-4 py-3.5 text-sm font-semibold transition-colors ${
                  activeTab === id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <Icon className="inline mr-1.5 text-xs" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Account</h2>
                  <div className="rounded-xl bg-gray-50 p-4 space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Mobile</span>
                      <p className="font-medium text-gray-900">
                        {user?.phone_number ? `+91 ${user.phone_number}` : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">User ID</span>
                      <p className="font-mono text-xs text-gray-800 break-all">{userId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaWallet className="text-primary" />
                      <span className="text-gray-500">Wallet</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(walletBalance)}</span>
                    </div>
                  </div>
                </div>

                {currentOrders.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Active Orders</h2>
                    <div className="space-y-3">
                      {currentOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="rounded-xl bg-gray-50 p-4 flex justify-between items-center gap-3">
                          <div>
                            <p className="font-semibold">#{order.order_number}</p>
                            <p className="text-sm text-gray-500">{formatCurrency(order.final_amount)}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusClasses(order.order_status)}`}>
                            {order.order_status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                {currentOrders.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Current Orders</h2>
                    <div className="space-y-4">
                      {currentOrders.map((order) => <OrderCard key={order.id} order={order} primaryAction />)}
                    </div>
                  </div>
                )}
                {previousOrders.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Previous Orders</h2>
                    <div className="space-y-4">
                      {previousOrders.map((order) => <OrderCard key={order.id} order={order} />)}
                    </div>
                  </div>
                )}
                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <FaShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No orders yet</p>
                    <button
                      onClick={() => navigate('/')}
                      className="mt-4 px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div key={address.id} className="rounded-xl border border-gray-200 p-5">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div>
                          {address.is_default && (
                            <span className="inline-block mb-2 px-2.5 py-0.5 bg-primary text-white text-xs font-semibold rounded-full">
                              Default
                            </span>
                          )}
                          <p className="font-bold text-gray-900">{address.receiver_name}</p>
                          <p className="text-gray-700 text-sm mt-2">{address.address_line1}</p>
                          {address.address_line2 && <p className="text-gray-700 text-sm">{address.address_line2}</p>}
                          <p className="text-gray-700 text-sm">
                            {address.city}, {address.state} - {address.postal_code}
                          </p>
                          <p className="text-gray-700 text-sm">{address.country}</p>
                          <p className="text-gray-500 text-sm mt-2">{address.receiver_phone}</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          {!address.is_default && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center gap-2 justify-center"
                            >
                              <FaCheck /> Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 justify-center"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No saved addresses</p>
                    <button
                      onClick={() => navigate('/cart')}
                      className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
