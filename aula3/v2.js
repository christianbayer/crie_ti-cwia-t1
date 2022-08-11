const https = require('https');

const anos = [ 2022, 2023, 2024, 2025 ];
const todosFeriados = [];
let requestsTerminados = 0;

anos.forEach(function(ano, indice) {
  https.get('https://brasilapi.com.br/api/feriados/v1/' + ano, function(response) {
    let dados = '';
    response.on('data', function (buffer) {
      dados += buffer;
    });
    response.on('end', function () {
      dados = JSON.parse(dados);

      const feriados = [];
      dados.forEach(function(item, indice) {
        feriados.push({
          nome: item.name,
          data: item.date
        });
      });

      todosFeriados.push(feriados);

      requestsTerminados++;

      if (requestsTerminados === anos.length) {
        console.log(todosFeriados);
      }
    })
  });
});
