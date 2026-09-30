const Order = require('../models/Order');
const Product = require('../models/Product');
const { createNotification } = require('./notificationController');

// CREATE order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) totalPrice += product.price * item.qty;
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      totalPrice,
      paymentStatus: 'pending',
    });

    // Notification to admin
    if (createNotification) {
      try {
        await createNotification(
          req.user._id,
          'Order Placed',
          `Your order #${order._id.toString().slice(-8)} has been placed.`,
          'order',
          '/orders'
        );
      } catch (err) {
        console.error('Notification error:', err);
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('CREATE ORDER ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET my orders
const getMyOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'vendor') {
      const products = await Product.find({ vendor: req.user._id }).select('_id');
      const productIds = products.map((p) => p._id);

      orders = await Order.find({ 'items.product': { $in: productIds } })
        .populate('user', 'name email')
        .populate('items.product', 'name price images')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: req.user._id })
        .populate('items.product', 'name price images')
        .sort({ createdAt: -1 });
    }

    res.json(orders);
  } catch (error) {
    console.error('GET MY ORDERS ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price images');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all orders (admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    if (req.body.status === 'delivered') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
};