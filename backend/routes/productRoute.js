const express = require('express');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
} = require('../controllers/productController');

// auth
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/products').get(getAllProducts);
router
  .route('/product/new')
  //need to be  have role "admin" after loginAuth is passed
  .post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router
  .route('/product/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)
  .get(getProductDetail);

module.exports = router;
