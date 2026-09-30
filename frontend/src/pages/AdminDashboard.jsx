import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    try {
      const [u, p, o] = await Promise.all([
        API.get('/admin/users').catch(() => ({ data: [] })),
        API.get('/admin/products').catch(() => ({ data: [] })),
        API.get('/admin/orders').catch(() => ({ data: [] })),
      ]);
      setUsers(u.data || []);
      setProducts(p.data || []);
      setOrders(o.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleApproveUser = async (id) => {
    try {
      await API.put(`/admin/users/${id}/approve`);
      toast.success('User approved!');
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted!');
      fetchAllData();
    } catch (err) {
      toast.error('Failed');
    }
  };

  const handleApproveProduct = async (id) => {
    try {
      await API.put(`/products/${id}/approve`);
      toast.success('Product approved!');
      fetchAllData();
    } catch (err) {
      toast.error('Failed to approve product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted!');
      fetchAllData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success('Status updated!');
      fetchAllData();
    } catch (err) {
      toast.error('Failed');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
  
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2">Welcome, {user.name}!</p>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-green-700">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-3xl font-bold text-blue-700">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-orange-700">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-700">
              Rs. {orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        
        <div className="flex gap-2 mb-8">
          {['users', 'products', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg capitalize ${
                activeTab === tab ? 'bg-green-700 text-white' : 'bg-white border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold">{u.name}</td>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                u.role === 'admin'
                                  ? 'bg-red-100 text-red-700'
                                  : u.role === 'vendor'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {u.isApproved ? (
                              <span className="text-green-700 font-semibold">✅ Approved</span>
                            ) : (
                              <span className="text-yellow-600 font-semibold">⏳ Pending</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {!u.isApproved && u.role !== 'admin' && (
                                <button
                                  onClick={() => handleApproveUser(u._id)}
                                  className="bg-green-700 text-white px-3 py-1 rounded text-sm hover:bg-green-800"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                {products.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No products found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((p) => (
                      <div key={p._id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                        <img
                          src={p.images?.[0] || 'https://placehold.co/300x300?text=Product'}
                          alt={p.name}
                          className="w-full h-40 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x300?text=Product';
                          }}
                        />
                        <h3 className="font-semibold mt-2">{p.name}</h3>
                        {p.brand && <p className="text-xs text-gray-500">{p.brand}</p>}
                        <p className="text-green-700 font-bold">Rs. {p.price}</p>
                        <p className="text-xs text-gray-500">Stock: {p.stock}</p>
                        <p className="text-xs text-gray-500">
                          Vendor: {p.vendor?.name || 'N/A'}
                        </p>
                        {p.category && (
                          <p className="text-xs text-gray-500">Category: {p.category}</p>
                        )}
                        {p.martName && (
                          <p className="text-xs text-gray-500">Mart: {p.martName}</p>
                        )}

                        <div className="mt-2">
                          {p.isApproved ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                              ✅ Approved
                            </span>
                          ) : (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded inline-block">
                              ⏳ Pending
                            </span>
                          )}
                        </div>

                       
                        <div className="flex gap-2 mt-3">
                          {!p.isApproved && (
                            <button
                              onClick={() => handleApproveProduct(p._id)}
                              className="flex-1 bg-green-700 text-white px-3 py-1.5 rounded text-sm hover:bg-green-800"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">Order ID</th>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Total</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs">
                            {o._id.slice(-8)}
                          </td>
                          <td className="px-4 py-3">{o.user?.name || 'N/A'}</td>
                          <td className="px-4 py-3 font-bold">Rs. {o.totalPrice}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                o.status === 'delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : o.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-700'
                                  : o.status === 'cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                              className="px-2 py-1 border rounded text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;