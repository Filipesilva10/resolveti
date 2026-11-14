const $ = seletor => document.querySelector(seletor);
function avisar(texto) { $('#aviso').textContent = texto; $('#aviso').hidden = false; }
async function api(rota, metodo = 'GET', dados) {
  const resposta = await fetch('/api' + rota, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: metodo === 'GET' ? undefined : JSON.stringify(dados || {}) });
  const resultado = await resposta.json();
  if (!resposta.ok) {
    if (resposta.status === 401) { $('#sistema').hidden = true; $('#login').hidden = false; }
    throw new Error(resultado.erro);
  }
  return resultado;
}
async function listar() {
  const chamados = await api('/chamados');
  $('#lista').replaceChildren();
  if (!chamados.length) $('#lista').textContent = 'Você ainda não tem chamados.';
  for (const chamado of chamados) {
    const item = document.createElement('article');
    item.className = 'mensagem';
    const titulo = document.createElement('strong');
    titulo.textContent = `#${chamado.id} · ${chamado.titulo}`;
    const info = document.createElement('p');
    info.textContent = `${chamado.status} · ${chamado.prioridade}`;
    item.append(titulo, info);
    $('#lista').append(item);
  }
}
async function entrar(usuario) {
  $('#login').hidden = true; $('#sistema').hidden = false;
  $('#usuario').textContent = usuario.nome;
  $('#form-chamado').hidden = usuario.perfil !== 'solicitante';
  await listar();
}
function form(id, acao) {
  $(id).onsubmit = async evento => {
    evento.preventDefault();
    const botao = evento.submitter;
    botao.disabled = true;
    try { await acao(Object.fromEntries(new FormData(evento.currentTarget))); }
    catch (erro) { avisar(erro.message); }
    finally { botao.disabled = false; }
  };
}
form('#form-login', async dados => { await entrar(await api('/login', 'POST', dados)); $('#form-login').reset(); $('#aviso').hidden = true; });
form('#form-chamado', async dados => { const c = await api('/chamados', 'POST', dados); $('#form-chamado').reset(); await listar(); avisar(`Chamado #${c.id} registrado com sucesso.`); });
$('#atualizar').onclick = () => listar().catch(erro => avisar(erro.message));
$('#sair').onclick = async () => { try { await api('/sair', 'POST'); $('#sistema').hidden = true; $('#login').hidden = false; $('#aviso').hidden = true; } catch (erro) { avisar(erro.message); } };
api('/eu').then(entrar).catch(() => {});
