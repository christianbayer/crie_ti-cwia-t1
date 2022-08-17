const funcaoComRetorno = () => {
  return 'Olá da função!';
}

const promiseComRetorno = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Olá da promise!');
    }, 100);
  })
}

const logar = (data) => {
  console.log(data);
}

const retorno1 = funcaoComRetorno();
const retorno2 = promiseComRetorno();

retorno2.then((data) => {
  logar(data);
});

retorno2.then(logar);

const main = async () => {
  const retorno3 = await promiseComRetorno();
  console.log(retorno3);
}

main();

console.log({ retorno1, retorno2 })
