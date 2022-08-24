const express = require('express');
const fs = require('fs');
const fsPromises = fs.promises;

const USERS_FILENAME = './users.json';
const PORT = 3000;

const getUsers = () => {
  return new Promise(async (resolve, reject) => {
    const dados = await fsPromises.readFile(USERS_FILENAME, 'utf-8');
    resolve(JSON.parse(dados));
  });
}

const findUser = (id) => {
  return new Promise(async (resolve, reject) => {
    const users = await getUsers();
    const user = users.find((user) => user.id === id);
    resolve(user);
  });
}

const createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    const users = await getUsers();
    const id = users[users.length - 1].id + 1;
    data.id = id;
    users.push(data);
    await fsPromises.writeFile(USERS_FILENAME, JSON.stringify(users));
    resolve(data);
  });
}

const updateUser = (data, id) => {
  return new Promise(async (resolve, reject) => {
    const users = await getUsers();
    const index = users.findIndex((user) => user.id === id);
    data.id = id;
    users[index] = data;
    await fsPromises.writeFile(USERS_FILENAME, JSON.stringify(users));
    resolve(data);
  });
}

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    const users = await getUsers();
    const index = users.findIndex((user) => user.id === id);
    users.splice(index, 1);
    await fsPromises.writeFile(USERS_FILENAME, JSON.stringify(users));
    resolve();
  });
}

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
  next();
});

app.get('/', (req, res, next) => {
  res.json({ content: 'Hello World' });
});

app.get('/users', async (req, res, next) => {
  const users = await getUsers();
  res.json(users);
});

app.post('/users', async (req, res, next) => {
  const user = await createUser(req.body);
  res.json(user);
});

app.get('/users/:userId', async (req, res, next) => {
  const user = await findUser(Number(req.params.userId));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/users/:userId', async (req, res, next) => {
  const user = await updateUser(req.body, Number(req.params.userId));
  res.json(user);
});

app.delete('/users/:userId', async (req, res, next) => {
  await deleteUser(Number(req.params.userId));
  res.json({});
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
