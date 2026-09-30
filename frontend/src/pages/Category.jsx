import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/categories';
import API from '../api/axios';

const Category = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        const filtered = data.filter((p) => p.categorySlug === slug);
        setProducts(filtered);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="text-green-700 mb-4 inline-block hover:underline">← Back to Home</Link>

        <h1 className="text-3xl font-bold mb-2 capitalize">
          {category ? category.name : slug.replace(/-/g, ' ')}
        </h1>

        <p className="text-gray-500 mb-6">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm ${slug === cat.slug ? 'bg-green-700 text-white' : 'bg-white border hover:bg-gray-50'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-12">Loading...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-xl text-gray-600 mb-2">No products found in this category</p>
            <Link to="/products" className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 inline-block mt-4">
              View all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;