const productSchema = require('../models/productModel');

//*Create Products
exports.createProduct = async (req, res, next) => {
  const product = new productSchema(req.body);

  product
    .save()
    .then((data) => {
      res.json({
        message: 'success',
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

exports.getAllProducts = (req, res) => {
  res.status(200).json({
    message: 'route is working fine',
  });
};
