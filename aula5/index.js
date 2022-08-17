const http = require('http');

const PORT = 3000;

http.createServer((request, response) => {

  const url = request.url;
  const segments = url.split('/').filter((segment) => Boolean(segment));

  let status = 200;
  let data = {};

  if (url === '/') {
    data = { message: 'Olá mundo!' };
  } else if (url === '/users') {
    data = Array.apply(null, Array(100)).map((item, index) => ({ id: index + 1 }));
  } else if (segments[0] === 'users' && segments.length === 2) {
    const id = +segments[1];
    if (isNaN(id) || id < 1 || id > 100) {
      status = 404;
      data = { error: 'Recurso não encontrado!' };
    } else {
      data = { id: id };
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
