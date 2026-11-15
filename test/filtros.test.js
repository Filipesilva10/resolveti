import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filtrarChamados } from '../public/filtros.js';

const lista = [
  { id: 1, titulo: 'Impressão com falha', status: 'Aberto', prioridade: 'Alta' },
  { id: 12, titulo: 'Internet indisponível', status: 'Em atendimento', prioridade: 'Alta' },
  { id: 3, titulo: 'Impressora configurada', status: 'Concluído', prioridade: 'Baixa' }
];
test('Busca ignora acentos, maiúsculas e espaços externos', () => {
  assert.deepEqual(filtrarChamados(lista, ' IMPRESSAO ').map(c => c.id), [1]);
});
test('Número aceita formato exibido e não confunde 1 com 12', () => {
  assert.deepEqual(filtrarChamados(lista, '#001').map(c => c.id), [1]);
  assert.deepEqual(filtrarChamados(lista, '1').map(c => c.id), [1]);
});
test('Busca, situação e prioridade são combinadas', () => {
  assert.deepEqual(filtrarChamados(lista, 'impress', 'Concluído', 'Baixa').map(c => c.id), [3]);
  assert.equal(filtrarChamados(lista, 'impress', 'Aberto', 'Baixa').length, 0);
});
test('Limpar filtros restaura a lista sem modificar os dados originais', () => {
  assert.deepEqual(filtrarChamados(lista), lista);
  assert.equal(lista.length, 3);
  assert.deepEqual(filtrarChamados([], 'qualquer'), []);
});
