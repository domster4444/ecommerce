const productSchema = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const ApiFeatures = require('../utils/apifeatures');

//*Create Products --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  // when user is logged in , we assigned req.user = {doc of user who logged in }
  // passing req.body.user explicitly
  req.body.user = req.user.id;
  //!directly saving from req.body so, if we send rating & review while createing product, those rating will be saved
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
  //!error check for ui react-alert test check-----------
  // return next(new ErrorHandler('this is my temp err', 404));
  //!error check for ui react-alert test check-----------

  const resultPerPage = 8;
  // no of total product document
  const productsCount = await productSchema.countDocuments();
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
    productsCount,
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

//* create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productSchema.findById(productId);

  // todo: does any of the reviews user-id of that product match with loggedIn-user-id ?
  // todo: by default if no review there still will be review user-id generated automatically ,
  // todo: due to type: mongoose.Schema.ObjectId,

  //? (if id matched with any of the reviews.user)
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    //todo: iteration on each {} in [{user,name,rating,comment},{user...},{user,...}]
    product.reviews.forEach((rev) => {
      // rev = {firstReview} -> {secondReview}
      //todo:Again, check review user-id with userId of logged in user
      if (rev.user.toString() === req.user._id.toString()) {
        //* already reviewed so, update the review ,
        //*-- editing(updating) review if already reviewed
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    //NOT REVIEWED THAN execute all below commands
    product.reviews.push(review);
    //*reseting "numOfReviews" field in document by recounting total reviews
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  //iterate through every rating
  product.reviews.forEach((rev) => {
    // add rating to avg on every iteration :::aft iteration is finished(avg = totalRatingGiven)
    avg = avg + rev.rating;
  });
  product.rating = avg / product.reviews.length;
  console.log(product.rating);
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});
