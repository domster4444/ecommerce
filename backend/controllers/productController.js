const productSchema = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const ApiFeatures = require('../utils/apifeatures');

//*Create Products --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  // when user is logged in , we assigned req.user = {doc of user who logged in }
  // passing req.body.user explicitly
  req.body.user = req.user.id;

  const product = await productSchema.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//?get a product detail
exports.getProductDetail = catchAsyncErrors(async (req, res, next) => {
  const product = await productSchema.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('product not found', 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//?get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 5;
  // no of total product document
  const productCount = await productSchema.countDocuments();
  //filter api feature
  const apiFeature = new ApiFeatures(productSchema.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  //query of apiFeatureCls is "productSchema.find()"
  const allProducts = await apiFeature.query;
  res.status(200).json({
    message: 'getAllProduct --route working fine',
    // allproducts:all document just fetched
    allProducts,
    productCount,
  });
});

//?update product --admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await productSchema.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('product not found', 500));
  }
  product = await productSchema.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//? delete product --admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await productSchema.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('product not found', 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: 'product deleted successfully',
  });
});
