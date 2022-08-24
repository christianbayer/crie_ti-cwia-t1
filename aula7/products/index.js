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

const validateData = async (data) => {
  const product = {};
  const attributes = ['name', 'brand', 'price'];
  for (const attribute of attributes) {
    if (! data[attribute]) {
      throw new Error(`The attribute "${attribute}" is required`);
    }
    product[attribute] = data[attribute];
  }

  if (await checkIfNameExists(product.name)) {
    throw new Error(`The product "${product.name}" already exists`);
  }

  return product;
}

const checkIfNameExists = async (name) => {
  const products = await getProducts();
  const product = products.find((p) => p.name === name);

  return Boolean(product);
}

const validateId = async (req, res, next) => {
  if (! await findProduct(Number(req.params.productId))) {
    return res.status(404).send({ error: 'Product not found' });
  }
  next();
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
  try {
    const data = await validateData(req.body);
    const product = await createProduct(data);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/products/:productId', validateId, async (req, res, next) => {
  const product = await findProduct(Number(req.params.productId));
  res.json(product);
});

app.put('/products/:productId', validateId, async (req, res, next) => {
  try {
    const data = await validateData(req.body);
    const product = await updateProduct(data, Number(req.params.productId));
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/products/:productId', validateId, async (req, res, next) => {
  await deleteProduct(Number(req.params.productId));
  res.json({});
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
