import { abrirBanco } from './banco.js';
import { criarApp } from './app.js';
const banco = abrirBanco();
const porta = Number(process.env.PORT) || 3001;
criarApp(banco).listen(porta, '127.0.0.1', () => console.log(`ResolveTI — etapa inicial: http://localhost:${porta}`));
