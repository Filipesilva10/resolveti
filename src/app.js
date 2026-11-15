import express from 'express';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { conferirSenha } from './banco.js';
import { Usuario, Chamado, Mensagem } from './modelos.js';

export function criarApp(banco) {
  const app = express();
  const sessoes = new Map();
  const tentativas = new Map();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    if (req.path.startsWith('/api/')) res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use(express.json({ limit: '16kb' }));
  // Requisições de alteração exigem JSON, sem liberar CORS para outros sites.
  app.use('/api', (req, res, next) => {
    if (req.method !== 'GET' && !req.is('application/json')) return res.status(415).json({ erro: 'Envie os dados em JSON.' });
    if (req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({ erro: 'Origem não permitida.' });
    next();
  });
  app.post('/api/login', (req, res) => {
    const agora = Date.now();
    for (const [chave, valor] of sessoes) if (valor.expira < agora) sessoes.delete(chave);
    for (const [chave, valor] of tentativas) if (valor.expira < agora) tentativas.delete(chave);
    const registro = tentativas.get(req.ip) || { total: 0, expira: agora + 60000 };
    if (registro.total >= 15) return res.status(429).json({ erro: 'Muitas tentativas. Aguarde um minuto.' });
    registro.total++;
    tentativas.set(req.ip, registro);
    const { email, senha } = req.body || {};
    if (typeof email !== 'string' || typeof senha !== 'string' || senha.length > 128) return res.status(400).json({ erro: 'Informe e-mail e senha válidos.' });
    const usuario = banco.prepare('SELECT * FROM usuarios WHERE email = ?').get(email.trim().toLowerCase());
    if (!usuario || !conferirSenha(senha, usuario.senha)) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    const token = randomBytes(32).toString('hex');
    sessoes.set(token, { id: usuario.id, expira: agora + 8 * 60 * 60 * 1000 });
    res.cookie('etapas', token, { httpOnly: true, sameSite: 'strict', maxAge: 8 * 60 * 60 * 1000, secure: req.secure });
    res.json({ id: usuario.id, nome: usuario.nome, perfil: usuario.perfil });
  });
  app.use('/api', (req, res, next) => {
    const token = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('etapas='))?.slice(7);
    const sessao = sessoes.get(token);
    if (!sessao || sessao.expira < Date.now()) return res.status(401).json({ erro: 'Entre na sua conta para continuar.' });
    const dados = banco.prepare('SELECT id,nome,email,perfil FROM usuarios WHERE id = ?').get(sessao.id);
    req.usuario = new Usuario(dados);
    req.token = token;
    next();
  });
  app.get('/api/eu', (req, res) => res.json(req.usuario));
  app.post('/api/sair', (req, res) => {
    sessoes.delete(req.token);
    res.clearCookie('etapas');
    res.json({ ok: true });
  });
  const consulta = `SELECT c.*, u.nome AS solicitante, t.nome AS tecnico FROM chamados c
    JOIN usuarios u ON u.id = c.solicitante_id LEFT JOIN usuarios t ON t.id = c.tecnico_id`;
  app.get('/api/chamados', (req, res) => {
    const lista = req.usuario.ehTecnico()
      ? banco.prepare(consulta + ' ORDER BY c.id DESC').all()
      : banco.prepare(consulta + ' WHERE c.solicitante_id = ? ORDER BY c.id DESC').all(req.usuario.id);
    res.json(lista);
  });
  app.post('/api/chamados', (req, res) => {
    if (req.usuario.ehTecnico()) return res.status(403).json({ erro: 'Abra chamados com o perfil de solicitante.' });
    const c = Chamado.validar(req.body || {});
    const resultado = banco.prepare(`INSERT INTO chamados(titulo,descricao,categoria,prioridade,solicitante_id,criado_em) VALUES (?,?,?,?,?,?)`)
      .run(c.titulo, c.descricao, c.categoria, c.prioridade, req.usuario.id, new Date().toISOString());
    res.status(201).json({ id: Number(resultado.lastInsertRowid) });
  });
  app.use('/api/chamados/:id', (req, res, next) => {
    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(Number(req.params.id))) return res.status(404).json({ erro: 'Chamado não encontrado.' });
    const dados = banco.prepare(consulta + ' WHERE c.id = ?').get(Number(req.params.id));
    if (!dados || !req.usuario.podeConsultar(dados)) return res.status(404).json({ erro: 'Chamado não encontrado.' });
    req.chamado = new Chamado(dados);
    next();
  });
  app.get('/api/chamados/:id', (req, res) => {
    const mensagens = banco.prepare(`SELECT m.*, u.nome AS autor FROM mensagens m JOIN usuarios u ON u.id = m.autor_id WHERE chamado_id = ? ORDER BY m.id`).all(req.chamado.id);
    res.json({ ...req.chamado, mensagens });
  });
  app.post('/api/chamados/:id/iniciar', (req, res) => {
    req.chamado.iniciar(req.usuario);
    banco.prepare('UPDATE chamados SET status = ?, tecnico_id = ? WHERE id = ?').run(req.chamado.status, req.usuario.id, req.chamado.id);
    res.json({ ok: true });
  });
  app.post('/api/chamados/:id/concluir', (req, res) => {
    req.chamado.concluir(req.usuario, req.body?.solucao);
    banco.prepare('UPDATE chamados SET status = ?, solucao = ?, concluido_em = ? WHERE id = ?')
      .run(req.chamado.status, req.chamado.solucao, new Date().toISOString(), req.chamado.id);
    res.json({ ok: true });
  });
  app.post('/api/chamados/:id/mensagens', (req, res) => {
    if (req.chamado.status === 'Concluído') return res.status(400).json({ erro: 'Chamados concluídos não recebem novas mensagens.' });
    const mensagem = new Mensagem(req.body?.conteudo);
    banco.prepare('INSERT INTO mensagens(chamado_id,autor_id,conteudo,criado_em) VALUES (?,?,?,?)')
      .run(req.chamado.id, req.usuario.id, mensagem.conteudo, new Date().toISOString());
    res.status(201).json({ ok: true });
  });
  app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
  app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));
  app.use((erro, req, res, next) => {
    if (erro.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' });
    if (erro.type === 'entity.too.large') return res.status(413).json({ erro: 'Conteúdo muito grande.' });
    if (erro.code) { console.error(erro); return res.status(500).json({ erro: 'Não foi possível salvar. Tente novamente.' }); }
    res.status(400).json({ erro: erro.message });
  });
  return app;
}
