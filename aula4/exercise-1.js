const obterPessoa = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        nome: 'Christian',
        sobrenome: 'Bayer',
        idade: 25
      });
    }, 10)
  });
}

const imprimirDadosPessoa = (dados) => {
  console.log(`Nome: ${dados.nome} ${dados.sobrenome}`);
  console.log(`Idade: ${dados.idade}`);
}

obterPessoa()
  .then((banana) => {
    imprimirDadosPessoa(banana);
  });
