import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { marts } from '../data/marts';

const SalesmanRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    martName: '',
    martLocation: '',
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append('image', image);

      await API.post('/auth/register-salesman', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Registered! Wait for admin approval.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Become a Salesman</h1>
        <p className="text-center text-gray-600 mb-8">Sell your products on Nepali Mart</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700" required />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700" required />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700" required />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700" required />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Mart Name</label>
            <select name="martName" value={formData.martName} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-700" required>
              <option value="">Select Mart</option>
              {marts.map((mart) => (
                <option key={mart.id} value={mart.name}>{mart.name} - {mart.location}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Profile Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800">
            Register as Salesman
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-green-700">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SalesmanRegister;