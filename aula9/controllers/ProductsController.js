const { Op } = require('sequelize');
const ProductModel = require('../models/Product');

class ProductsController {

  index = async (req, res, next) => {
    res.json(await ProductModel.findAll());
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
    res.json(await ProductModel.findByPk(req.params.productId));
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.productId;
      const data = await this._validateData(req.body, id);
      await ProductModel.update(data, {
        where: {
          id: id
        }
      })
      res.json(await ProductModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await ProductModel.destroy({
      where: {
        id: req.params.productId
      }
    });
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
    const where = {
      name: name
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await ProductModel.count({
      where: where
    });

    return count > 0;
  }

}

module.exports = new ProductsController();
