const express = require('express');
const UserModel = require('./models/User');

const PORT = 3000;

const validateData = async (data, id) => {
  const attributes = ['name', 'age', 'sex', 'email'];
  const user = {};
  for (const attribute of attributes) {
    if (! data[attribute]){
      throw new Error(`The attribute "${attribute}" is required.`);
    }
    user[attribute] = data[attribute];
  }

  if (await checkIfEmailExists(user.email, id)) {
    throw new Error(`The user with mail address "${user.email}" already exists.`);
  }

  return user;
}

const checkIfEmailExists = async (email, id) => {
  const users = await UserModel.all();
  const user = users.find((user) => user.email === email && user.id !== Number(id));

  return Boolean(user);
}

const validateUserId = async (req, res, next) => {
  const user = await UserModel.find(req.params.userId);
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
  const users = await UserModel.all();
  res.json(users);
});

app.post('/users', async (req, res, next) => {
  try {
    const data = await validateData(req.body);
    const user = await UserModel.create(data);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/users/:userId', validateUserId, async (req, res, next) => {
  const user = await UserModel.find(req.params.userId);
  res.json(user);
});

app.put('/users/:userId', validateUserId, async (req, res, next) => {
  try {
    const id = req.params.userId;
    const data = await validateData(req.body, id);
    const user = await UserModel.update(data, id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/users/:userId', validateUserId, async (req, res, next) => {
  await UserModel.delete(req.params.userId);
  res.json({});
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
