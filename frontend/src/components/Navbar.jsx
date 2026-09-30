import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${query.trim()}`);
      setQuery('');
    } else {
      navigate('/products');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">

        <Link to="/" className="text-2xl font-extrabold text-green-700 whitespace-nowrap">
          Nepali<span className="text-orange-500">Mart</span>
        </Link>

   
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full px-4 py-2 border border-r-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <button
            type="submit"
            className="bg-green-700 text-white px-5 py-2 rounded-r-lg hover:bg-green-800 transition"
          >
            <FaSearch />
          </button>
        </form>

       
        <div className="flex items-center gap-3">
      
          {(!user || user.role === 'customer') && (
            <Link
              to="/cart"
              className="text-gray-700 hover:text-green-700 relative"
            >
              <FaShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              {user.role === 'vendor' && (
                <Link
                  to="/salesman/dashboard"
                  className="text-green-700 font-semibold hover:underline hidden md:inline"
                >
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-green-700 font-semibold hover:underline hidden md:inline"
                >
                  Admin
                </Link>
              )}
              {user.role === 'customer' && (
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-green-700 hidden md:inline"
                >
                  Orders
                </Link>
              )}
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-green-700"
              >
                <FaUser size={20} />
                <span className="hidden md:inline font-semibold">
                  {user.name?.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-red-600 border border-red-600 px-3 py-1.5 rounded hover:bg-red-600 hover:text-white text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-green-700 border border-green-700 px-4 py-2 rounded hover:bg-green-700 hover:text-white text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;