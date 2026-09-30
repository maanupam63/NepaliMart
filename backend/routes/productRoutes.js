const express = require('express');
const router = express.Router();
const {
  getProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/myproducts', protect, getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, upload.single('image'), createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.put('/:id/approve', protect, admin, approveProduct);

module.exports = router;