const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetail,
  updateUserPassword,
  updateProfileData,
  getAllUserAdmin,
  getUserDetailAdmin,
  updateAnyProfileAdmin,
  deleteAnyUser,
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticatedUser, getUserDetail);
router.route('/password/update').put(isAuthenticatedUser, updateUserPassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfileData);

router
  .route('/admin/users')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllUserAdmin);
router
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetailAdmin)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateAnyProfileAdmin)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteAnyUser);

module.exports = router;
