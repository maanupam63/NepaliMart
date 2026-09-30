import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get('payment');
    const method = searchParams.get('method');

    if (payment === 'success') {
      toast.success(`${method === 'esewa' ? 'eSewa' : 'Khalti'} payment successful!`);
      clearCart();
    } else if (payment === 'failed') {
      toast.error('Payment failed! Please try again.');
    }
  }, [searchParams, clearCart]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please login to view orders</p>
          <Link to="/login" className="bg-green-700 text-white px-6 py-2 rounded-lg">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">No orders yet</p>
            <Link to="/products" className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.paymentStatus || 'pending'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between mb-2">
                      <span>{item.name} x {item.qty}</span>
                      <span>Rs. {item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Payment: <span className="font-semibold">{order.paymentMethod}</span>
                  </div>
                  <div className="font-bold text-lg">
                    Total: <span className="text-green-700">Rs. {order.totalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;