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

const createServer = (users) => {
  http.createServer((request, response) => {

    const url = request.url;
    const segments = url.split('/').filter((segment) => Boolean(segment));

    let status = 200;
    let data = {};

    if (url === '/users') {
      data = users;
    } else if (segments[0] === 'users' && segments.length === 2) {
      const id = +segments[1];
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
  }).listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
  });
}

getUsers().then((users) => {
  createServer(users);
})
