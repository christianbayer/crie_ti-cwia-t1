const https = require('https');

const anos = [2022, 2023, 2024, 2025];
let todosFeriados = [];
let requestsTerminados = 0;

anos.forEach(function (ano, indice) {
    https.get('https://brasilapi.com.br/api/feriados/v1/' + ano, function (response) {
        let dados = '';
        response.on('data', function (buffer) {
            dados += buffer;
        });
        response.on('end', function () {
            todosFeriados = todosFeriados.concat(JSON.parse(dados));

            requestsTerminados++;

            if (requestsTerminados === anos.length) {
                todosFeriados.sort(function (a, b) {
                    if (new Date(a.date) < new Date(b.date)) {
                        return -1;
                    }
                    if (new Date(a.date) > new Date(b.date)) {
                        return 1;
                    }
                    return 0;
                });

                const feriados = [];
                todosFeriados.forEach(function (item, indice) {
                    feriados.push({
                        nome: item.name,
                        data: item.date.split('-').reverse().join('/')
                    });
                });

                console.log(feriados);
            }
        })
    });
});
