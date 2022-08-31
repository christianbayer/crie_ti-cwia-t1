const { DataTypes, Model } = require('sequelize');
const db = require('../db');

class Product extends Model { };

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: 'products',
  modelName: 'Product'
});

module.exports = Product;
