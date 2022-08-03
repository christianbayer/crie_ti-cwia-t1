// Declaração de array
var nomes = [
  'Ana',
  'Júlio',
  'Xico',
  'João',
  'Brenda',
  // Uso de aspas em uma string:
  // 'Diga "Olá!"',
  // "Diga \"Olá!\"",
  // `Diga "Olá!"`,
];
console.log(nomes);

// Adicionar item no final array
nomes.push('Douglas');
console.log(nomes);

// Remover o último item do array
nomes.pop();
console.log(nomes);

// Adicionar item no início do array
nomes.unshift('Fabricio');
console.log(nomes);

// Remover item do início do array
nomes.shift();
console.log(nomes);

// Inserir item no meio do array
nomes.splice(2, 0, 'Faustão');
console.log(nomes);

// Declaração de objeto
var pessoa = {
  nome: 'Juca',
  sobrenome: 'Bala',
  altura: 1.80
}
console.log(pessoa);
