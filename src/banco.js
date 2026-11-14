import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export function gerarHash(senha) {
  const sal = randomBytes(16).toString('hex');
  return `${sal}:${scryptSync(senha, sal, 64).toString('hex')}`;
}
export function conferirSenha(senha, hash) {
  const [sal, esperado] = hash.split(':');
  return timingSafeEqual(Buffer.from(esperado, 'hex'), scryptSync(senha, sal, 64));
}
export function abrirBanco(caminho = resolve('dados/resolveti.sqlite')) {
  if (caminho !== ':memory:') mkdirSync(dirname(caminho), { recursive: true });
  const banco = new DatabaseSync(caminho);
  banco.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY, nome TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL, perfil TEXT NOT NULL CHECK(perfil IN ('solicitante','tecnico'))
    );
    CREATE TABLE IF NOT EXISTS chamados (
      id INTEGER PRIMARY KEY, titulo TEXT NOT NULL, descricao TEXT NOT NULL,
      categoria TEXT NOT NULL, prioridade TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Aberto' CHECK(status IN ('Aberto','Em atendimento','Concluído')),
      solicitante_id INTEGER NOT NULL REFERENCES usuarios(id),
      tecnico_id INTEGER REFERENCES usuarios(id), solucao TEXT,
      criado_em TEXT NOT NULL, concluido_em TEXT
    );
    CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY, chamado_id INTEGER NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
      autor_id INTEGER NOT NULL REFERENCES usuarios(id), conteudo TEXT NOT NULL, criado_em TEXT NOT NULL
    );
  `);
  const inserir = banco.prepare('INSERT INTO usuarios(nome,email,senha,perfil) VALUES (?,?,?,?)');
  for (const [nome, email, perfil] of [
    ['Filipe (demonstração)', 'solicitante@resolveti.local', 'solicitante'],
    ['Ana (demonstração)', 'ana@resolveti.local', 'solicitante'],
    ['Técnico (demonstração)', 'tecnico@resolveti.local', 'tecnico']
  ]) {
    if (!banco.prepare('SELECT id FROM usuarios WHERE email = ?').get(email)) inserir.run(nome, email, gerarHash('Demo@123'), perfil);
  }
  return banco;
}
