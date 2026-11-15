function normalizar(texto) {
  return String(texto).trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Combina os filtros sobre a lista que o servidor autorizou para o usuário.
export function filtrarChamados(chamados, busca = '', status = '', prioridade = '') {
  const termo = normalizar(busca);
  const numero = termo.replace(/^#/, '');
  return chamados.filter(chamado => {
    const tituloEncontrado = normalizar(chamado.titulo).includes(termo);
    const numeroEncontrado = /^\d+$/.test(numero) && chamado.id === Number(numero);
    return (tituloEncontrado || numeroEncontrado)
      && (!status || chamado.status === status)
      && (!prioridade || chamado.prioridade === prioridade);
  });
}
