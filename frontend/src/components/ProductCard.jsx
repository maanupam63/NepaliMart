import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-lg shadow hover:shadow-2xl transition-all duration-300 p-3 transform hover:-translate-y-2 group relative"
    >
     
      {product.discountPercent > 0 && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow z-10">
          {product.discountPercent}% OFF
        </span>
      )}

      
      <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition z-10">
        ❤️
      </button>

    
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={product.images?.[0] || 'https://placehold.co/300x300?text=Product'}
          alt={product.name}
          className="w-full h-40 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
        />
      </div>

    
      <h3 className="font-semibold text-sm mt-2 line-clamp-2 group-hover:text-green-700 transition-colors">
        {product.name}
      </h3>

 
      <p className="text-xs text-gray-500">{product.brand}</p>

     
      <div className="flex items-center gap-2 mt-2">
        <p className="text-green-700 font-bold">
          Rs. {product.discountPrice || product.price}
        </p>
        {product.discountPrice && (
          <p className="text-gray-400 text-sm line-through">Rs. {product.price}</p>
        )}
      </div>

     
      <div className="flex items-center gap-1 mt-1">
        <span className="text-yellow-500 text-sm">⭐ {product.rating || 0}</span>
        <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
      </div>

      {product.stock > 0 ? (
        <p className="text-xs text-green-600 mt-1">In Stock</p>
      ) : (
        <p className="text-xs text-red-600 mt-1">Out of Stock</p>
      )}

    
      <button className="w-full bg-green-700 text-white py-2 rounded-lg mt-2 opacity-0 group-hover:opacity-100 transition">
        Add to Cart
      </button>
    </Link>
  );
};

export default ProductCard;