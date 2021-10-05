const orderSchema = require('../models/orderModel');
const productSchema = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//*______________________________create new order --user
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderSchema.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//*_______________________________get all orders --user (get logged in user order customer order)
// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderSchema.find({ user: req.user._id });
  if (!orders) {
    return next(new ErrorHandler('order dont exist', 404));
  }
  res.status(200).json({
    success: true,
    orders,
  });
});

//!______________________________get  single order info of  any user  -admin
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderSchema
    .findById(req.params.id)
    .populate('user', 'name email');
  if (!order) {
    return next(new ErrorHandler('order not found with this id', 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//!______________________________All orders --admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderSchema.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//!_____________________________update order status  -admin
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await orderSchema.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('order not found with this id', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(
      new ErrorHandler('you have already delivered this product', 404)
    );
  }
  //?updating stock
  order.orderItems.forEach(async (order) => {
    /**
     * @arg {orderedProductIdFromOrderSchema} -from orderedModel
     * @arg {orderedProductQuantityFromOrderSchema}   -from orderedModel
     */
    const orderedProductIdFromOrderSchema = order.product;
    const orderedProductQuantityFromOrderSchema = order.quantity;
    //😀 passed in this function
    await updateStock(
      orderedProductIdFromOrderSchema,
      orderedProductQuantityFromOrderSchema
    );
  });

  order.orderStatus = req.body.status;

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
  // 😀 the function
  async function updateStock(id, quantity) {
    /**
     * decrease product quantity from product schema
     * @param {orderedProductIdFromOrderSchema} -id to find product to decrease quantity
     * @param {orderedProductQuantityFromOrderSchema} -quantity to decrease
     */
    //* get productSchema for decreasing quantity of any specific productId
    const product = await productSchema.findById(id);
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
});

//!___________________________delete order --admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderSchema.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler('order not found with this id', 404));
  }
  await order.remove();
  res.status(200).json({
    success: true,
  });
});
