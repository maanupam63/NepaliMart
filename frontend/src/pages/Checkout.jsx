import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [formData, setFormData] = useState({
    city: '',
    area: '',
    landmark: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        shippingAddress: formData,
        paymentMethod,
      };

      const { data: order } = await API.post('/orders', orderData);
      const totalAmount = totalPrice + 100;

      // ESEWA PAYMENT
      if (paymentMethod === 'eSewa') {
        toast.success('Redirecting to eSewa...');

        const { data: paymentResponse } = await API.post('/payment/esewa/initiate', {
          amount: totalAmount,
          orderId: order._id,
        });

        if (paymentResponse.success) {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = paymentResponse.paymentUrl;

          Object.keys(paymentResponse.paymentData).forEach((key) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentResponse.paymentData[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        } else {
          toast.error('eSewa initiation failed');
          setLoading(false);
        }
      }

      // KHALTI PAYMENT
      else if (paymentMethod === 'Khalti') {
        toast.success('Redirecting to Khalti...');

        const { data: paymentResponse } = await API.post('/payment/khalti/initiate', {
          amount: totalAmount,
          orderId: order._id,
          customerInfo: {
            name: user.name,
            email: user.email,
            phone: formData.phone,
          },
        });

        if (paymentResponse.success && paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
        } else {
          toast.error(paymentResponse.message || 'Khalti initiation failed');
          setLoading(false);
        }
      }

      // ============================================
      // CASH ON DELIVERY
      // ============================================
      else {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Order failed');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={formData.city}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700"
              required
            />
            <input
              type="text"
              name="area"
              placeholder="Area *"
              value={formData.area}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700"
              required
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone *"
              value={formData.phone}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700"
              required
            />
          </div>

          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { id: 'COD', label: 'Cash on Delivery', color: 'gray' },
              { id: 'eSewa', label: 'eSewa', color: 'green' },
              { id: 'Khalti', label: 'Khalti', color: 'purple' },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`p-4 border-2 rounded-lg text-center transition ${
                  paymentMethod === method.id
                    ? 'border-green-700 bg-green-50 text-green-700 font-semibold'
                    : 'border-gray-300 hover:border-green-700'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="border-t pt-4 mb-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between mb-2">
                <span>{item.name} x {item.qty}</span>
                <span>Rs. {(item.price) * item.qty}</span>
              </div>
            ))}
            <div className="flex justify-between mt-2">
              <span>Delivery:</span>
              <span>Rs. 100</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-xl">
              <span>Total:</span>
              <span className="text-green-700">Rs. {(totalPrice + 100).toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg disabled:bg-gray-400 ${
              paymentMethod === 'eSewa'
                ? 'bg-green-700 hover:bg-green-800'
                : paymentMethod === 'Khalti'
                ? 'bg-purple-700 hover:bg-purple-800'
                : 'bg-green-700 hover:bg-green-800'
            }`}
          >
            {loading
              ? 'Processing...'
              : paymentMethod === 'COD'
              ? 'Place Order (COD)'
              : `Pay with ${paymentMethod}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;