import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { banners } from '../data/banners';
import { brands } from '../data/brands';
import { testimonials } from '../data/testimonials';
import ProductCard from '../components/ProductCard';
import API from '../api/axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const flashSales = products
    .filter((p) => p.discountPercent >= 8)
    .slice(0, 10);

  const topRated = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Welcome to Nepali Mart
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Nepal's Largest Online Grocery Store
          </p>
          <Link
            to="/products"
            className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold">{banner.title}</h2>
            <p className="mt-2">{banner.subtitle}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Prompt Delivery', desc: 'Fastest delivery guaranteed' },
          { title: 'Reward Points', desc: 'Earn on every purchase' },
          { title: 'Genuine Products', desc: 'Authorized vendors' },
          { title: 'Mode of Payment', desc: 'Cash/Card/Cellpay/E-sewa' },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition"
          >
            <h3 className="font-bold text-green-700">{feature.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/products" className="text-green-700 hover:underline text-sm">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="bg-white p-3 rounded-lg shadow hover:shadow-xl text-center cursor-pointer transition transform hover:-translate-y-2"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-16 h-16 mx-auto rounded-full object-cover"
              />
              <p className="text-xs font-semibold mt-2">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">⚡ Flash Sales & Offers</h2>
          <Link to="/products" className="text-green-700 hover:underline text-sm">
            View All →
          </Link>
        </div>
        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : flashSales.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No flash sales available</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {flashSales.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {topRated.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">⭐ Top Rated Products</h2>
            <Link to="/products" className="text-green-700 hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {topRated.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Brands</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/products?brand=${brand.name}`}
              className="bg-white p-4 rounded-lg shadow text-center hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-16 h-16 mx-auto rounded-full object-cover"
              />
              <p className="text-sm font-semibold mt-2">{brand.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Customer Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
            >
              <p className="text-gray-600">{t.text}</p>
              <p className="font-bold mt-4">{t.name}</p>
              <p className="text-yellow-500">{'⭐'.repeat(t.rating)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;