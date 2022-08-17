const http = require('http');

const PORT = 3000;

http.createServer((request, response) => {

  const url = request.url;

  if (url === '/') {
    response.writeHead(200, { 'Content-type': 'text/html; charset=utf8' });
    response.write('Olá mundo!');
  } else {
    response.writeHead(404, { 'Content-type': 'text/html; charset=utf8' });
    response.write('Página não encontrada!');
  }

  console.log(url);

  response.end();
}).listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
