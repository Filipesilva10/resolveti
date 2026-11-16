import { filtrarChamados } from './filtros.js';

const $ = seletor => document.querySelector(seletor);
let usuario;
let chamados = [];
let chamadoAtual;
let avisoTimer;

function avisar(mensagem, erro = false) {
  $('#aviso').textContent = mensagem;
  $('#aviso').className = erro ? 'erro' : 'sucesso';
  $('#aviso').hidden = false;
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => { $('#aviso').hidden = true; }, 6000);
}
async function api(caminho, metodo = 'GET', dados) {
  let resposta;
  try {
    resposta = await fetch('/api' + caminho, {
      method: metodo,
      headers: metodo === 'GET' ? {} : { 'Content-Type': 'application/json' },
      body: metodo === 'GET' ? undefined : JSON.stringify(dados || {})
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.');
  }
  if (resposta.status === 401) mostrarLogin();
  const resultado = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(resultado?.erro || 'Não foi possível concluir a ação. Tente novamente.');
  }
  if (resultado === null) throw new Error('O servidor retornou uma resposta inesperada. Tente novamente.');
  return resultado;
}
// textContent evita interpretar texto de chamados como código HTML.
function elemento(tag, conteudo, classe) {
  const item = document.createElement(tag);
  item.textContent = conteudo;
  if (classe) item.className = classe;
  return item;
}
function classeStatus(status) { return { 'Aberto': 'aberto', 'Em atendimento': 'andamento', 'Concluído': 'concluido' }[status]; }
function data(valor) { return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); }
function tela(nome) {
  for (const id of ['listagem', 'cadastro', 'detalhes']) $('#' + id).hidden = id !== nome;
  window.scrollTo(0, 0);
}
function mostrarLogin() {
  $('#login').hidden = false;
  $('#sistema').hidden = true;
  usuario = null;
  chamados = [];
  chamadoAtual = null;
  for (const form of document.querySelectorAll('form')) form.reset();
  for (const seletor of ['#busca', '#filtro-status', '#filtro-prioridade']) $(seletor).value = '';
}
async function entrar(dados) {
  usuario = dados;
  $('#login').hidden = true;
  $('#sistema').hidden = false;
  $('#nome-usuario').textContent = `${usuario.nome} · ${usuario.perfil === 'tecnico' ? 'Técnico' : 'Solicitante'}`;
  $('#titulo-lista').textContent = usuario.perfil === 'tecnico' ? 'Central de chamados' : 'Meus chamados';
  $('#subtitulo-lista').textContent = usuario.perfil === 'tecnico' ? 'Organize a fila e acompanhe cada atendimento.' : 'Acompanhe suas solicitações em um só lugar.';
  $('#novo').hidden = usuario.perfil === 'tecnico';
  await carregar();
}
async function carregar() {
  chamados = await api('/chamados');
  $('#total').textContent = chamados.length;
  $('#abertos').textContent = chamados.filter(c => c.status === 'Aberto').length;
  $('#andamento').textContent = chamados.filter(c => c.status === 'Em atendimento').length;
  $('#concluidos').textContent = chamados.filter(c => c.status === 'Concluído').length;
  renderizarLista();
  tela('listagem');
}
function renderizarLista() {
  const lista = filtrarChamados(chamados, $('#busca').value, $('#filtro-status').value, $('#filtro-prioridade').value);
  $('#linhas').replaceChildren();
  for (const c of lista) {
    const linha = document.createElement('tr');
    const titulo = document.createElement('td');
    titulo.append(elemento('small', `#${String(c.id).padStart(3, '0')}`), elemento('strong', c.titulo));
    linha.append(titulo, elemento('td', c.categoria));
    const prioridade = document.createElement('td');
    prioridade.append(elemento('span', c.prioridade, 'prioridade ' + (c.prioridade === 'Alta' ? 'alta' : '')));
    const status = document.createElement('td');
    status.append(elemento('span', c.status, 'badge ' + classeStatus(c.status)));
    const acao = document.createElement('td');
    const botao = elemento('button', 'Ver →');
    botao.setAttribute('aria-label', `Ver chamado ${c.id}: ${c.titulo}`);
    botao.onclick = () => executar(() => abrirDetalhe(c.id));
    acao.append(botao);
    linha.append(prioridade, status, elemento('td', data(c.criado_em)), acao);
    $('#linhas').append(linha);
  }
  $('#vazio').hidden = lista.length > 0;
  $('#contagem').textContent = `${lista.length} de ${chamados.length} chamado(s)`;
}
async function abrirDetalhe(id) {
  const c = await api('/chamados/' + id);
  if (chamadoAtual !== c.id) {
    $('#form-mensagem').reset();
    $('#form-solucao').reset();
  }
  chamadoAtual = c.id;
  $('#numero-chamado').textContent = `CHAMADO #${String(c.id).padStart(3, '0')}`;
  $('#detalhe-titulo').textContent = c.titulo;
  $('#detalhe-meta').textContent = 'Aberto em ' + data(c.criado_em);
  $('#detalhe-status').textContent = c.status;
  $('#detalhe-status').className = 'badge ' + classeStatus(c.status);
  $('#detalhe-descricao').textContent = c.descricao;
  $('#bloco-solucao').hidden = !c.solucao;
  $('#detalhe-solucao').textContent = c.solucao || '';
  $('#informacoes').replaceChildren();
  for (const [nome, valor] of [['Solicitante', c.solicitante], ['Categoria', c.categoria], ['Prioridade', c.prioridade], ['Responsável', c.tecnico || 'Aguardando técnico'], ['Conclusão', c.concluido_em ? data(c.concluido_em) : 'Ainda não concluído']]) $('#informacoes').append(elemento('dt', nome), elemento('dd', valor));
  $('#iniciar').hidden = usuario.perfil !== 'tecnico' || c.status !== 'Aberto';
  $('#form-solucao').hidden = usuario.perfil !== 'tecnico' || c.tecnico_id !== usuario.id || c.status !== 'Em atendimento';
  $('#form-mensagem').hidden = c.status === 'Concluído';
  $('#mensagens').replaceChildren();
  if (!c.mensagens.length) $('#mensagens').append(elemento('p', 'As mensagens deste atendimento aparecerão aqui.', 'ajuda'));
  for (const m of c.mensagens) {
    const item = elemento('article', '', 'mensagem');
    item.append(elemento('strong', m.autor), elemento('small', data(m.criado_em)), elemento('p', m.conteudo, 'texto-longo'));
    $('#mensagens').append(item);
  }
  tela('detalhes');
}
async function executar(acao, botao) {
  if (botao) botao.disabled = true;
  try { await acao(); } catch (erro) { avisar(erro.message, true); }
  finally { if (botao) botao.disabled = false; }
}
function formulario(id, acao) {
  $(id).addEventListener('submit', evento => {
    evento.preventDefault();
    const form = evento.currentTarget;
    executar(() => acao(Object.fromEntries(new FormData(form)), form), evento.submitter);
  });
}
formulario('#form-login', async dados => { await entrar(await api('/login', 'POST', dados)); $('#form-login').reset(); });
formulario('#form-chamado', async (dados, form) => { const c = await api('/chamados', 'POST', dados); form.reset(); await abrirDetalhe(c.id); avisar('Chamado aberto com sucesso.'); });
formulario('#form-mensagem', async (dados, form) => { await api(`/chamados/${chamadoAtual}/mensagens`, 'POST', dados); form.reset(); await abrirDetalhe(chamadoAtual); avisar('Mensagem enviada.'); });
formulario('#form-solucao', async (dados, form) => { await api(`/chamados/${chamadoAtual}/concluir`, 'POST', dados); form.reset(); await abrirDetalhe(chamadoAtual); avisar('Chamado concluído.'); });
$('#iniciar').onclick = evento => executar(async () => { await api(`/chamados/${chamadoAtual}/iniciar`, 'POST'); await abrirDetalhe(chamadoAtual); avisar('Atendimento iniciado.'); }, evento.currentTarget);
$('#sair').onclick = () => executar(async () => { await api('/sair', 'POST'); mostrarLogin(); });
$('#novo').onclick = () => tela('cadastro');
for (const botao of document.querySelectorAll('.voltar, #menu-chamados, #atualizar')) botao.onclick = () => executar(carregar);
for (const id of ['#busca', '#filtro-status', '#filtro-prioridade']) $(id).addEventListener('input', renderizarLista);
for (const perfil of ['solicitante', 'tecnico']) $('#demo-' + perfil).onclick = () => { $('#form-login [name=email]').value = perfil + '@resolveti.local'; $('#form-login [name=senha]').value = 'Demo@123'; };
// Restaura uma sessão existente sem exigir novo login ao atualizar a página.
api('/eu').then(entrar).catch(() => mostrarLogin());
