import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abrirBanco } from '../src/banco.js';
import { criarApp } from '../src/app.js';
import { requisitar } from './http-local.js';

test('Etapa inicial: autenticar, abrir, listar e proteger os dados', async t => {
  const banco = abrirBanco(':memory:');
  const app = criarApp(banco);
  t.after(() => banco.close());
  const login = await requisitar(app, '/login', 'POST', { email: 'solicitante@resolveti.local', senha: 'Demo@123' });
  assert.equal(login.status, 200);
  const cookie = login.cookie;
  const invalido = await requisitar(app, '/chamados', 'POST', {}, cookie);
  assert.equal(invalido.status, 400);
  const criado = await requisitar(app, '/chamados', 'POST', { titulo: 'Falha no sistema', descricao: 'O sistema não abre desde cedo.', categoria: 'Sistema', prioridade: 'Média' }, cookie);
  assert.equal(criado.status, 201);
  const lista = await requisitar(app, '/chamados', 'GET', null, cookie);
  assert.equal(lista.dados.length, 1);
  assert.equal((await requisitar(app, '/chamados')).status, 401);
});
