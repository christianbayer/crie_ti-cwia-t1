const https = require('https');

const httpsGet = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let dados = '';
      response.on('data', (buffer) => {
        dados += buffer;
      });
      response.on('end', () => {
        resolve(JSON.parse(dados));
      })
    }).on('error', (error) => {
      reject(error);
    });
  });
}

const buscarFeriados = (anos) => {
  return new Promise((resolve, reject) => {
    let feriados = [];
    let requestsTerminados = 0;
    anos.forEach((ano) => {
      httpsGet('https://brasilapi.com.br/api/feriados/v1/' + ano)
        .then((dados) => {
          feriados = feriados.concat(dados);
          requestsTerminados++;
          if (requestsTerminados === anos.length) {
            resolve(feriados)
          }
        })
    });
  });
}

const ordenarFeriados = (feriados) => {
  return new Promise((resolve, reject) => {
    feriados.sort(function (a, b) {
      if (new Date(a.date) < new Date(b.date)) {
        return -1;
      }
      if (new Date(a.date) > new Date(b.date)) {
        return 1;
      }
      return 0;
    });
    resolve(feriados);
  })
}

const formatarFeriados = (feriados) => {
  return feriados.map((item) => {
    return {
      nome: item.name,
      data: item.date.split('-').reverse().join('/')
    }
  });
}

const imprimirFeriados = (feriados) => {
  console.log(feriados);
}

const main = () => {
  const anos = [2022, 2023, 2024, 2025];

  buscarFeriados(anos)
    .then(ordenarFeriados)
    .then(formatarFeriados)
    .then(imprimirFeriados)
}

main();
