const express = require('express');
const fs = require('fs');
const fsPromises = fs.promises;

const FILENAME = './products.json';
const PORT = 3000;

const getProducts = () => {
  return new Promise(async (resolve, reject) => {
    const data = await fsPromises.readFile(FILENAME, 'utf-8');
    resolve(JSON.parse(data));
  });
}

const findProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    const products = await getProducts();
    const product = products.find((p) => p.id === id);
    resolve(product);
  });
}

const createProduct = (product) => {
  return new Promise(async (resolve, reject) => {
    const products = await getProducts();
    const lastProduct = products[products.length - 1];
    const id = (lastProduct ? lastProduct.id : 0) + 1;
    product.id = id;
    products.push(product);
    await fsPromises.writeFile(FILENAME, JSON.stringify(products));
    resolve(product);
  });
}

const updateProduct = (product, id) => {
  return new Promise(async (resolve, reject) => {
    const products = await getProducts();
    const index = products.findIndex((p) => p.id === id);
    product.id = id;
    products[index] = product;
    await fsPromises.writeFile(FILENAME, JSON.stringify(products));
    resolve(product);
  });
}

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    const products = await getProducts();
    const index = products.findIndex((p) => p.id === id);
    products.splice(index, 1);
    await fsPromises.writeFile(FILENAME, JSON.stringify(products));
    resolve();
  });
}

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
  next();
});

app.get('/products', async (req, res, next) => {
  const products = await getProducts();
  res.json(products);
});

app.post('/products', async (req, res, next) => {
  const product = await createProduct(req.body);
  res.json(product);
});

app.get('/products/:productId', async (req, res, next) => {
  const product = await findProduct(Number(req.params.productId));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.put('/products/:productId', async (req, res, next) => {
  const product = await updateProduct(req.body, Number(req.params.productId));
  res.json(product);
});

app.delete('/products/:productId', async (req, res, next) => {
  await deleteProduct(Number(req.params.productId));
  res.json({});
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
