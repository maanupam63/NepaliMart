import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/categories';
import { marts } from '../data/marts';
import toast from 'react-hot-toast';

const SalesmanDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', brand: '', stock: '', martName: '', martLocation: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login');
      return;
    }
    fetchMyProducts();
    fetchMyOrders();
  }, [user, navigate]);

  const fetchMyProducts = async () => {
    try {
      const { data } = await API.get('/products/myproducts');
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (imageFile) data.append('image', imageFile);

      await API.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product added! Wait for admin approval.');
      setShowForm(false);
      setFormData({ name: '', description: '', price: '', category: '', brand: '', stock: '', martName: '', martLocation: '' });
      setImageFile(null);
      fetchMyProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    }
    setLoading(false);
  };

  if (!user || user.role !== 'vendor') return null;

  const totalSales = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="mt-2">Salesman Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-3xl font-bold text-green-700">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-blue-700">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <p className="text-3xl font-bold text-purple-700">Rs. {totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-lg capitalize ${activeTab === 'products' ? 'bg-green-700 text-white' : 'bg-white border'}`}>
            Products
          </button>
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-2 rounded-lg capitalize ${activeTab === 'orders' ? 'bg-green-700 text-white' : 'bg-white border'}`}>
            Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Products</h2>
              <button onClick={() => setShowForm(!showForm)} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
                {showForm ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder="Product Name *" value={formData.name} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
                  <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="px-4 py-2 border rounded-lg" />
                  <input type="number" name="price" placeholder="Price (Rs.) *" value={formData.price} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
                  <input type="number" name="stock" placeholder="Stock *" value={formData.stock} onChange={handleChange} className="px-4 py-2 border rounded-lg" required />
                  <select name="category" value={formData.category} onChange={handleChange} className="px-4 py-2 border rounded-lg" required>
                    <option value="">Select Category *</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                  <select name="martName" value={formData.martName} onChange={handleChange} className="px-4 py-2 border rounded-lg">
                    <option value="">Select Mart (Optional)</option>
                    {marts.map((mart) => <option key={mart.id} value={mart.name}>{mart.name} - {mart.location}</option>)}
                  </select>
                  <input type="text" name="martLocation" placeholder="Mart Location" value={formData.martLocation} onChange={handleChange} className="px-4 py-2 border rounded-lg" />
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="px-4 py-2 border rounded-lg" />
                  <textarea name="description" placeholder="Description *" value={formData.description} onChange={handleChange} className="px-4 py-2 border rounded-lg md:col-span-2" required />
                </div>
                <button type="submit" disabled={loading} className="mt-4 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 disabled:bg-gray-400">
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            )}

            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No products added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {products.map((p) => (
                  <div key={p._id} className="bg-white rounded-lg shadow p-4">
                    <img src={p.images?.[0] || 'https://placehold.co/300x300?text=Product'} alt={p.name} className="w-full h-40 object-cover rounded" />
                    <h3 className="font-semibold mt-2">{p.name}</h3>
                    <p className="text-green-700 font-bold">Rs. {p.price}</p>
                    <span className={`text-xs px-2 py-1 rounded inline-block mt-2 ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.isApproved ? '✅ Approved' : '⏳ Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                      <span className={`px-3 py-1 rounded text-sm ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between mb-2">
                          <span>{item.name} x {item.qty}</span>
                          <span>Rs. {item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 mt-4 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-green-700">Rs. {order.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesmanDashboard;