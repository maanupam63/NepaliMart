const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  discountPrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  category: { type: String, required: true },
  categorySlug: { type: String, required: true },
  brand: { type: String, default: '' },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  martName: { type: String, default: '' },
  martLocation: { type: String, default: '' },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);