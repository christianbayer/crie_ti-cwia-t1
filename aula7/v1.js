const express = require('express');

const PORT = 3000;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
  next();
});

app.get('/', (req, res, next) => {
  res.json({ content: 'Hello World' });
});

app.get('/users', (req, res, next) => {
  // Pega os dados do arquivo
  res.json([
    { name: 'John Doe' },
    { name: 'Jane Doe' },
  ]);
});

app.post('/users', (req, res, next) => {
  console.log(req.body);
  // Salva o usuário no arquivo
  res.json({ name: 'John Doe' });
});

app.get('/users/:userId', (req, res, next) => {
  console.log(req.params);
  // Pega o usuário do arquivo
  res.json({ name: 'John Doe' });
});

app.put('/users/:userId', (req, res, next) => {
  console.log(req.params);
  console.log(req.body);
  // Atualiza o usuário no arquivo
  res.json({ name: 'John Doe' });
});

app.delete('/users/:userId', (req, res, next) => {
  console.log(req.params);
  // Exclui o usuário do arquivo
  res.json({});
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});
