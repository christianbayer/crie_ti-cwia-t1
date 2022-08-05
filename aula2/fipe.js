var https = require('https');

console.log('Antes do https.get');

https.get('https://parallelum.com.br/fipe/api/v2/cars/brands', function (response) {
  var data = '';
  response.on('data', function (buffer) {
    data += buffer;
  });
  response.on('end', function () {
    var marcas = JSON.parse(data);

    // var marcasJuntas = '';
    // for (var i = 0; i < marcas.length - 1; i++) {
    //   marcasJuntas += marcas[i].name;
    //   if (i < marcas.length - 2) {
    //     marcasJuntas += ', ';
    //   }
    // }

    // var marcasJuntas = '';
    // marcas.forEach(function (marca, index) {
    //   marcasJuntas += marca.name;
    //   if (index < marcas.length - 1) {
    //     marcasJuntas += ', ';
    //   }
    // });
    // console.log(marcasJuntas);

    var marcasJuntas = marcas.map(function (marca) {
      return marca.name;
    }).join(', ');
    console.log(marcasJuntas);

  });
});

console.log('Depois do https.get');

