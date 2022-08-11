function funcaoUm () {
  console.log('Função 1');
}
funcaoUm();

const funcaoDois = function () {
  console.log('Função 2');
}
funcaoDois();

const funcaoTres = () => {
  return 'Olá!';
}
console.log(funcaoTres());

const funcaoQuatro = () => 'Olá!';
console.log(funcaoQuatro());


// const funcaoCinco = function (name) {
//   return 'Olá ' + nome + '!';
// }
const funcaoCinco = (nome, sobrenome) => `Olá ${nome} ${sobrenome}!`;
console.log(funcaoCinco('Marilene', 'da Silva'));
