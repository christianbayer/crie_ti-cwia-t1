const funcaoUm = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Terminou a função 1');
      resolve('Juca Bala');
      // reject('Ops! Algo deu errado.');
    }, 2000);
  })
}

const funcaoDois = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Terminou a função 2');
      resolve();
    }, 1000);
  });
}

const funcaoTres = () => {
  setTimeout(() => {
    console.log('Terminou a função 3');
  }, 500)
}

// funcaoUm()
//   .then((nome) => {
//     console.log(nome);
//     funcaoDois().then(() => {
//       funcaoTres();
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// funcaoUm()
//   .then((nome) => {
//     console.log(nome);
//     return funcaoDois();
//   })
//   .then(() => {
//     funcaoTres();
//   })
//   .catch((error) => {
//     console.log(error);
//   });

funcaoUm()
  .then((nome) => {
    console.log(nome);
    return funcaoDois();
  })
  .then(funcaoTres)
  .catch((error) => {
    console.log(error);
  });
