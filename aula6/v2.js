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
      } else if (method === 'GET' && segments[0] === 'users' && segments.length === 2) {
        const id = +segments[1];
        const users = await getUsers();
        const user = users.find((user) => user.id === id);
        if (user) {
          data = user;
        } else {
          status = 404;
          data = { error: 'Recurso não encontrado!' };
        }
      } else {
        status = 404;
        data = { error: 'Página não encontrada!' };
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
