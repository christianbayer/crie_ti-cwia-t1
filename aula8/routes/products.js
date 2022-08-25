const router = require('express').Router();
const ProductModel = require('../models/Product');
const productsController = require('../controllers/ProductsController');

const validateProductId = async (req, res, next) => {
  const product = await ProductModel.find(req.params.productId);
  if (! product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  next();
}

router.get('/products', productsController.index);

router.post('/products', productsController.create);

router.get('/products/:productId', validateProductId, productsController.show);

router.put('/products/:productId', validateProductId, productsController.update);

router.delete('/products/:productId', validateProductId, productsController.delete);

module.exports = router;
