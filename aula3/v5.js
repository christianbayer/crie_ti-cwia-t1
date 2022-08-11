const https = require('https');

const anos = [2022, 2023, 2024, 2025];
let todosFeriados = [];
let requestsTerminados = 0;

anos.forEach(function (ano) {
  buscarFeriados(ano);
});

function buscarFeriados(ano) {
  fazerRequest('https://brasilapi.com.br/api/feriados/v1/' + ano, function (dados) {
    todosFeriados = todosFeriados.concat(dados);
    requestsTerminados++;
    if (requestsTerminados === anos.length) {
      ordenarFeriados();
    }
  });
}

function fazerRequest(url, callback) {
  https.get(url, function (response) {
    let dados = '';
    response.on('data', function (buffer) {
      dados += buffer;
    });
    response.on('end', function () {
      callback(JSON.parse(dados));
    })
  });
}

function ordenarFeriados() {
  todosFeriados.sort(function (a, b) {
    if (new Date(a.date) < new Date(b.date)) {
      return -1;
    }
    if (new Date(a.date) > new Date(b.date)) {
      return 1;
    }
    return 0;
  });

  formatarFeriados();
}

function formatarFeriados() {
  todosFeriados = todosFeriados.map(function (item) {
    return {
      nome: item.name,
      data: item.date.split('-').reverse().join('/')
    }
  })

  imprimirFeriados();
}

function imprimirFeriados() {
  console.log(todosFeriados);
}
