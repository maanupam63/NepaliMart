const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  shippingAddress: {
    city: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String, default: '' },
    phone: { type: String, required: true },
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentRef: { type: String, default: '' },
  totalPrice: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);