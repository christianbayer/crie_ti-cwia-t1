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

        // Formato atual:
        // yyyy-mm-dd

        // Formato desejado:
        // dd/mm/yyyy

        feriados.push({
          nome: item.name,
          data: item.date.split('-').reverse().join('/')
        });

        // Alternativa ao item.date.split('-').reverse().join('/'):
        // const partes = item.date.split('-');
        // const date = partes[2] + '/' + partes[1] + '/' + partes[0];
        // console.log(date);
      });

      todosFeriados.push(feriados);

      requestsTerminados++;

      if (requestsTerminados === anos.length) {
        console.log(todosFeriados);
      }
    })
  });
});
