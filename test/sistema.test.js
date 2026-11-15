import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { abrirBanco, gerarHash } from '../src/banco.js';
import { criarApp } from '../src/app.js';
import { requisitar } from './http-local.js';

test('Fluxo completo, validações e proteção entre perfis', async t => {
  const banco = abrirBanco(':memory:');
  const app = criarApp(banco);
  t.after(() => banco.close());
  const pedir = (caminho, metodo, dados, cookie) => requisitar(app, caminho, metodo, dados, cookie);
  assert.equal((await pedir('/chamados')).status, 401);
  assert.equal((await pedir('/login', 'POST', { email: 'solicitante@resolveti.local', senha: 'errada' })).status, 401);
  const login = perfil => pedir('/login', 'POST', { email: perfil + '@resolveti.local', senha: 'Demo@123' });
  const solicitante = (await login('solicitante')).cookie;
  const tecnico = (await login('tecnico')).cookie;
  const ana = (await login('ana')).cookie;
  banco.prepare('INSERT INTO usuarios(nome,email,senha,perfil) VALUES (?,?,?,?)').run('Outro técnico', 'outro@resolveti.local', gerarHash('Demo@123'), 'tecnico');
  const outro = (await login('outro')).cookie;
  let id;
  await t.test('Rejeita dados incompletos e prioridade inválida', async () => {
    assert.equal((await pedir('/chamados', 'POST', {}, solicitante)).status, 400);
    assert.equal((await pedir('/chamados', 'POST', { titulo: 'Teste chamado', descricao: 'Descrição de teste', categoria: 'Outro', prioridade: 'Urgente' }, solicitante)).status, 400);
  });
  await t.test('Solicitante abre um chamado persistido', async () => {
    const resposta = await pedir('/chamados', 'POST', { titulo: 'Impressora não funciona', descricao: 'Não imprime desde o início da manhã.', categoria: 'Impressora', prioridade: 'Alta' }, solicitante);
    assert.equal(resposta.status, 201);
    id = resposta.dados.id;
    assert.equal((await pedir('/chamados', 'GET', null, solicitante)).dados.length, 1);
    assert.equal(banco.prepare('SELECT status FROM chamados WHERE id = ?').get(id).status, 'Aberto');
  });
  await t.test('Outro solicitante não pode consultar nem enviar mensagens', async () => {
    assert.equal((await pedir('/chamados', 'GET', null, ana)).dados.length, 0);
    assert.equal((await pedir(`/chamados/${id}`, 'GET', null, ana)).status, 404);
    assert.equal((await pedir(`/chamados/${id}/mensagens`, 'POST', { conteudo: 'Tentativa' }, ana)).status, 404);
  });
  await t.test('Solicitante não inicia atendimento; técnico não abre chamados', async () => {
    assert.equal((await pedir(`/chamados/${id}/iniciar`, 'POST', {}, solicitante)).status, 400);
    assert.equal((await pedir('/chamados', 'POST', {}, tecnico)).status, 403);
  });
  await t.test('Conclusão antes de iniciar é rejeitada', async () => {
    assert.equal((await pedir(`/chamados/${id}/concluir`, 'POST', { solucao: 'Uma solução completa.' }, tecnico)).status, 400);
  });
  await t.test('Técnico assume o chamado uma única vez', async () => {
    assert.equal((await pedir(`/chamados/${id}/iniciar`, 'POST', {}, tecnico)).status, 200);
    assert.equal((await pedir(`/chamados/${id}/iniciar`, 'POST', {}, tecnico)).status, 400);
  });
  await t.test('Troca de mensagens registra autor e conteúdo', async () => {
    assert.equal((await pedir(`/chamados/${id}/mensagens`, 'POST', { conteudo: '   ' }, tecnico)).status, 400);
    assert.equal((await pedir(`/chamados/${id}/mensagens`, 'POST', { conteudo: 'x'.repeat(1001) }, tecnico)).status, 400);
    assert.equal((await pedir(`/chamados/${id}/mensagens`, 'POST', { conteudo: 'Pode verificar o cabo?' }, tecnico)).status, 201);
    assert.equal((await pedir(`/chamados/${id}/mensagens`, 'POST', { conteudo: 'O cabo está conectado.' }, solicitante)).status, 201);
    const mensagens = (await pedir(`/chamados/${id}`, 'GET', null, solicitante)).dados.mensagens;
    assert.equal(mensagens.length, 2);
    assert.equal(mensagens[0].autor_id, 3);
    assert.equal(mensagens[1].autor_id, 1);
    assert.equal(mensagens[1].conteudo, 'O cabo está conectado.');
    assert.ok(mensagens.every(m => !Number.isNaN(Date.parse(m.criado_em))));
  });
  await t.test('Outro técnico não assume nem conclui atendimento alheio', async () => {
    assert.equal((await pedir(`/chamados/${id}/iniciar`, 'POST', {}, outro)).status, 400);
    assert.equal((await pedir(`/chamados/${id}/concluir`, 'POST', { solucao: 'Tentativa de outro técnico.' }, outro)).status, 400);
    assert.equal(banco.prepare('SELECT tecnico_id FROM chamados WHERE id = ?').get(id).tecnico_id, 3);
  });
  await t.test('Identificadores inválidos não produzem erro interno', async () => {
    for (const invalido of ['abc', '99999', '999999999999999999999999999999']) {
      assert.equal((await pedir('/chamados/' + invalido, 'GET', null, tecnico)).status, 404);
    }
  });
  await t.test('Conclusão exige solução; solicitante não pode concluir', async () => {
    assert.equal((await pedir(`/chamados/${id}/concluir`, 'POST', { solucao: '' }, tecnico)).status, 400);
    assert.equal((await pedir(`/chamados/${id}/concluir`, 'POST', { solucao: 'Descrição de uma solução.' }, solicitante)).status, 400);
    assert.equal((await pedir(`/chamados/${id}/concluir`, 'POST', { solucao: 'Driver reinstalado e impressão testada.' }, tecnico)).status, 200);
    const chamado = (await pedir(`/chamados/${id}`, 'GET', null, solicitante)).dados;
    assert.equal(chamado.status, 'Concluído');
    assert.ok(chamado.concluido_em);
  });
  await t.test('Chamado concluído não recebe mensagens nem nova conclusão', async () => {
    assert.equal((await pedir(`/chamados/${id}/mensagens`, 'POST', { conteudo: 'Outra mensagem' }, tecnico)).status, 400);
    assert.equal((await pedir(`/chamados/${id}/concluir`, 'POST', { solucao: 'Outra solução registrada.' }, tecnico)).status, 400);
  });
  await t.test('Logout invalida a sessão', async () => {
    assert.equal((await pedir('/sair', 'POST', {}, solicitante)).status, 200);
    assert.equal((await pedir('/eu', 'GET', null, solicitante)).status, 401);
  });
});

test('Banco mantém dados depois de fechar e reabrir', () => {
  const pasta = mkdtempSync(join(tmpdir(), 'resolveti-teste-'));
  const arquivo = join(pasta, 'teste.sqlite');
  try {
    let banco = abrirBanco(arquivo);
    banco.prepare(`INSERT INTO chamados(titulo,descricao,categoria,prioridade,solicitante_id,criado_em) VALUES (?,?,?,?,?,?)`).run('Teste persistência', 'Descrição de teste', 'Outro', 'Baixa', 1, new Date().toISOString());
    banco.close();
    banco = abrirBanco(arquivo);
    assert.equal(banco.prepare('SELECT COUNT(*) AS total FROM chamados').get().total, 1);
    assert.equal(banco.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total, 3);
    banco.close();
  } finally {
    const alvo = resolve(pasta);
    if (dirname(alvo) !== resolve(tmpdir()) || !basename(alvo).startsWith('resolveti-teste-')) throw new Error('Pasta temporária inesperada.');
    rmSync(alvo, { recursive: true });
  }
});
