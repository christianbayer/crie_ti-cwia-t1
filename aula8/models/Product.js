const fs = require('fs');
const fsPromises = fs.promises;

const FILENAME = './products.json';

class Product {

  static all = async () => {
    return JSON.parse(await fsPromises.readFile(FILENAME, 'utf-8'));
  }

  static find = async (id) => {
    const products = await this.all();
    return products.find((product) => product.id === Number(id));
  }

  static create = async (data) => {
    const products = await this.all();
    const id = (products.length ? products[products.length - 1].id : 0) + 1;
    data.id = id;
    products.push(data);
    await fsPromises.writeFile(FILENAME, JSON.stringify(products));
    return data;
  }

  static update = async (data, id) => {
    id = Number(id);
    const products = await this.all();
    const index = products.findIndex((product) => product.id === id);
    data.id = id;
    products[index] = data;
    await fsPromises.writeFile(FILENAME, JSON.stringify(products));
    return data;
  }

  static delete = async (id) => {
    const products = await this.all();
    const index = products.findIndex((product) => product.id === Number(id));
    products.splice(index, 1);
    await fsPromises.writeFile(FILENAME, JSON.stringify(products));
  }

}

module.exports = Product;
