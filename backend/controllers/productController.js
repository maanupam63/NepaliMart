const Product = require('../models/Product');
const { createNotification } = require('./notificationController');

// GET all products (approved only)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true }).populate('vendor', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET my products (vendor)
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor', 'name email');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE product
const createProduct = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const { name, description, price, category, brand, stock, martName, martLocation } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Image URL
    let imageUrl = '';
    if (req.file) {
      imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    // FIXED categorySlug
    const categorySlug = category
      .toLowerCase()
      .replace(/&/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s+/g, '-');

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      categorySlug,
      brand: brand || '',
      stock: Number(stock),
      images: imageUrl ? [imageUrl] : [],
      vendor: req.user._id,
      martName: martName || '',
      martLocation: martLocation || '',
      isApproved: false,
    });

    // Notification to admin
    await createNotification(
      req.user._id,
      'New Product Added',
      `${name} has been added and is waiting for approval.`,
      'product',
      '/salesman/dashboard'
    );

    res.status(201).json(product);
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE product (admin)
const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isApproved = true;
    await product.save();

    await createNotification(
      product.vendor,
      'Product Approved',
      `${product.name} has been approved and is now live.`,
      'product',
      '/salesman/dashboard'
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
};