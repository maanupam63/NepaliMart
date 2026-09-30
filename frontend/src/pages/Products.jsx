import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/categories';
import API from '../api/axios';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const brandName = searchParams.get('brand');
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  let filtered = products.filter((p) => {
    let match = true;
    if (categorySlug) match = match && p.categorySlug === categorySlug;
    if (searchQuery) match = match && p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (brandName) match = match && p.brand === brandName;
    return match;
  });

  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => (a.price) - (b.price));
  else if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => (b.price) - (a.price));
  else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  if (loading) return <div className="text-center py-16 text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {searchQuery ? `Search: "${searchQuery}"` : categorySlug ? categorySlug.replace(/-/g, ' ') : 'All Products'}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <Link to="/products" className={`px-4 py-2 rounded-full text-sm ${!categorySlug ? 'bg-green-700 text-white' : 'bg-white border hover:bg-gray-50'}`}>All</Link>
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} className={`px-4 py-2 rounded-full text-sm ${categorySlug === cat.slug ? 'bg-green-700 text-white' : 'bg-white border hover:bg-gray-50'}`}>
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex justify-end mb-6">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border rounded-lg bg-white">
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating: High to Low</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl text-gray-600 mb-2">No products found</p>
            <Link to="/products" className="text-green-700 hover:underline mt-4 inline-block">← View all products</Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">Showing {filtered.length} products</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;