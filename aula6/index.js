const http = require('http');
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

const createServer = () => {
  http.createServer((request, response) => {
    let payload = '';
    request.on('data', (buffer) => {
      payload += buffer;
    });
    request.on('end', async () => {
      payload = payload ? JSON.parse(payload) : undefined;

      const url = request.url;
      const method = request.method;
      const segments = url.split('/').filter((segment) => Boolean(segment));

      let status = 200;
      let data = {};

      if (method === 'GET' && url === '/users') {
        data = await getUsers();
      } else if (method === 'POST' && url === '/users') {
        data = await createUser(payload);
      } else if (method === 'PUT' && segments[0] === 'users' && segments.length === 2) {
        data = await updateUser(payload, parseInt(segments[1]));
      } else if (method === 'DELETE' && segments[0] === 'users' && segments.length === 2) {
        await deleteUser(parseInt(segments[1]));
        data = {};
      } else if (method === 'GET' && segments[0] === 'users' && segments.length === 2) {
        const user = await findUser(parseInt(segments[1]));
        if (user) {
          data = user;
        } else {
          status = 404;
          data = { error: 'Recurso n??o encontrado!' };
        }
      } else {
        status = 404;
        data = { error: 'P??gina n??o encontrada!' };
      }

      response.writeHead(status, { 'Content-type': 'application/json; charset=utf8' });
      response.write(JSON.stringify(data));
      response.end();
    });
  }).listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
  });
}

createServer();
