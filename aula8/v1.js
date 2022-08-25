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
    const id = (users.length ? users[users.length - 1].id : 0) + 1;
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

const validateData = async (data) => {
  const attributes = ['name', 'age', 'sex', 'email'];
  const user = {};
  for (const attribute of attributes) {
    if (! data[attribute]){
      throw new Error(`The attribute "${attribute}" is required.`);
    }
    user[attribute] = data[attribute];
  }

  if (await checkIfNameExists(user.name)) {
    throw new Error(`The user "${user.name}" already exists.`);
  }

  return user;
}

const checkIfNameExists = async (name) => {
  const users = await getUsers();
  const user = users.find((user) => user.name === name);

  return Boolean(user);
}

const validateUserId = async (req, res, next) => {
  const user = await findUser(Number(req.params.userId));
  if (! user) {
    return res.status(404).json({ error: 'User not found' });
  }
  next();
}

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
  next();
});

app.get('/users', async (req, res, next) => {
  const users = await getUsers();
  res.json(users);
});

app.post('/users', async (req, res, next) => {
  try {
    const data = await validateData(req.body);
    const user = await createUser(data);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/users/:userId', validateUserId, async (req, res, next) => {
  const user = await findUser(Number(req.params.userId));
  res.json(user);
});

app.put('/users/:userId', validateUserId, async (req, res, next) => {
  try {
    const data = await validateData(req.body);
    const user = await updateUser(data, Number(req.params.userId));
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/users/:userId', validateUserId, async (req, res, next) => {
  await deleteUser(Number(req.params.userId));
  res.json({});
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
