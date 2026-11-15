import { abrirBanco } from './banco.js';
import { criarApp } from './app.js';
// A demonstração pública usa um banco novo com contas fictícias a cada início.
const demonstracaoPublica = process.env.RESOLVETI_DEMO === '1';
const banco = abrirBanco(demonstracaoPublica ? ':memory:' : undefined);
const porta = Number(process.env.PORT) || 3001;
const endereco = demonstracaoPublica ? '0.0.0.0' : '127.0.0.1';
criarApp(banco, { demonstracaoPublica }).listen(porta, endereco, () => {
  console.log(`ResolveTI: ouvindo em ${endereco}:${porta}`);
});
