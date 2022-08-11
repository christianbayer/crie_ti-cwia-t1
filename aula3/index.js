const fs = require('fs');

const filename = 'students.json';

// Alterar a idade da "Tricia Moon" para 45
// Ativar (is_active = true) a "Jenna Cannon"
// Atualizar o arquivo

fs.readFile(filename, 'utf8', (error, data) => {
  data = JSON.parse(data);

  const tricia = data.find(student => student.name === 'Tricia Moon');
  tricia.age = 45;

  const jenna = data.find(student => student.name === 'Jenna Cannon');
  jenna.is_active = true;

  const content = JSON.stringify(data);

  fs.writeFile(filename, content, (error) => {
    //
  });
});
