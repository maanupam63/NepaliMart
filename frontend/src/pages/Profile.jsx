import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please login to view profile</p>
          <Link
            to="/login"
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-green-700 text-white rounded-full flex items-center justify-center text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span
                className={`inline-block px-3 py-1 rounded text-sm mt-2 ${
                  user.role === 'admin'
                    ? 'bg-red-100 text-red-700'
                    : user.role === 'vendor'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              to="/orders"
              className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
            >
              <h3 className="font-bold text-green-700">📦 My Orders</h3>
              <p className="text-sm text-gray-600">View your order history</p>
            </Link>

            <Link
              to="/cart"
              className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
            >
              <h3 className="font-bold text-green-700">🛒 My Cart</h3>
              <p className="text-sm text-gray-600">View your cart items</p>
            </Link>

            {user.role === 'vendor' && (
              <Link
                to="/salesman/dashboard"
                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
              >
                <h3 className="font-bold text-green-700">💼 Salesman Dashboard</h3>
                <p className="text-sm text-gray-600">Manage your products</p>
              </Link>
            )}

            {user.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
              >
                <h3 className="font-bold text-green-700">⚙️ Admin Dashboard</h3>
                <p className="text-sm text-gray-600">Manage entire store</p>
              </Link>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;