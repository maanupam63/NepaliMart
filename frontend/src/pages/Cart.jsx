import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <p className="text-xl text-gray-600">Your cart is empty</p>
          <Link to="/products" className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 inline-block mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length} items)</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <img
                    src={item.images?.[0] || 'https://placehold.co/100x100?text=Product'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">Rs. {item.discountPrice || item.price} x {item.qty}</p>
                    <p className="text-green-700 font-bold">Rs. {(item.discountPrice || item.price) * item.qty}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery:</span>
              <span>Rs. 100</span>
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between font-bold text-xl">
              <span>Total:</span>
              <span className="text-green-700">Rs. {(totalPrice + 100).toLocaleString()}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="block w-full bg-green-700 text-white text-center py-3 rounded-lg hover:bg-green-800 mt-6"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;