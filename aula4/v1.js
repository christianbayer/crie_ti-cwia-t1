const funcaoUm = (executarDepois) => {
  setTimeout(() => {
    console.log('Terminou a função 1');
    executarDepois();
  }, 2000);
}

const funcaoDois = () => {
  setTimeout(() => {
    console.log('Terminou a função 2');
  }, 1000);
}

funcaoUm(funcaoDois);

