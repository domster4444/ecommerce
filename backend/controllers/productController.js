const productSchema = require('../models/productModel');

//*Create Products --Admin
exports.createProduct = async (req, res, next) => {
  const product = new productSchema(req.body);

  product
    .save()
    .then((data) => {
      res.json({
        message: 'createProduct --route working fine',
        // data:document just created
        data,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        message: 'something went wront while saving product to db',
      });
    });
};

//?get all products
exports.getAllProducts = async (req, res) => {
  const allProducts = await productSchema.find();
  res.status(200).json({
    message: 'getAllProduct --route working fine',
    // allproducts:all document just fetched
    allProducts,
  });
};

//?update product --admin
exports.updateProduct = async (req, res) => {
  let product = await productSchema.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'product not found',
    });
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
};
