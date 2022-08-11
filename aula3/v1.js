const https = require('https');

https.get('https://brasilapi.com.br/api/feriados/v1/2022', function(response) {
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

    console.log('Terminou a requisição!');
    console.log(feriados);
  })
});
