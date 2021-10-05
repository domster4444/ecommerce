const express = require('express');
const {
  newOrder,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  myOrders,
  deleteOrder,
} = require('../controllers/orderController');
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route('/order/new').post(isAuthenticatedUser, newOrder); //😆
router.route('/order/me').get(isAuthenticatedUser, myOrders); //!ID route must always be at last else it will bring problem,
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder); //😆

//admin
router
  .route('/admin/orders')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders); //😆
router
  .route('/admin/order/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder); //😆

module.exports = router;
