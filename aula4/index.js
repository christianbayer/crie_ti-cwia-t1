const https = require('https');

const httpsGet = () => {
  return new Promise((resolve, reject) => {
    https.get('https://braslapi.com.br/api/feriados/v1/2022', (response) => {
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

httpsGet()
  .then((dados) => {
    console.log(dados);
  })
  .catch((error) => {
    console.log(error);
  });
