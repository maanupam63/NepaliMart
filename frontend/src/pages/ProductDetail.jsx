import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);

        const { data: allProducts } = await API.get('/products');
        const rel = allProducts.filter(
          (p) => p.categorySlug === data.categorySlug && p._id !== data._id
        );
        setRelated(rel);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
    navigate('/cart');
  };

  if (loading) return <div className="text-center py-16 text-xl">Loading...</div>;
  if (!product) return <div className="text-center py-16 text-xl">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/products" className="text-green-700 mb-4 inline-block hover:underline">← Back</Link>

        <div className="bg-white rounded-lg shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            src={product.images?.[0] || 'https://placehold.co/300x300?text=Product'}
            alt={product.name}
            className="w-full h-96 object-contain rounded-lg"
            onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=Product'; }}
          />
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            {product.brand && <p className="text-gray-500 mb-2">Brand: {product.brand}</p>}
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-green-700 font-bold text-3xl">Rs. {product.price}</p>
              {product.discountPrice > 0 && (
                <p className="text-gray-400 line-through">Rs. {product.discountPrice}</p>
              )}
            </div>
            <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
            {product.martName && <p className="text-gray-600 mb-4">Mart: {product.martName}</p>}
            <p className="text-yellow-500 mb-4">
              ⭐ {product.rating || 0} ({product.numReviews || 0} reviews)
            </p>
            <button
              onClick={handleAddToCart}
              className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 w-full md:w-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;