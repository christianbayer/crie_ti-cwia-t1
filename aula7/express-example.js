const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
  res.json({ content: 'Hello World' });
})

app.listen(3000);
