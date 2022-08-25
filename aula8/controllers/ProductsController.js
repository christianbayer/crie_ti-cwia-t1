const ProductModel = require('../models/Product');

class ProductsController {

  index = async (req, res, next) => {
    res.json(await ProductModel.all());
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const product = await ProductModel.create(data);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    res.json(await ProductModel.find(req.params.productId));
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.productId;
      const data = await this._validateData(req.body, id);
      res.json(await ProductModel.update(data, id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await ProductModel.delete(req.params.productId);
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['name', 'brand', 'price'];
    const product = {};
    for (const attribute of attributes) {
      if (! data[attribute]){
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      product[attribute] = data[attribute];
    }

    if (await this._checkIfNameExists(product.name, id)) {
      throw new Error(`The product with name "${product.name}" already exists.`);
    }

    return product;
  }

  _checkIfNameExists = async (name, id) => {
    const products = await ProductModel.all();
    const product = products.find((product) => product.name === name && product.id !== Number(id));

    return Boolean(product);
  }

}

module.exports = new ProductsController();
