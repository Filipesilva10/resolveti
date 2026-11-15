// As classes concentram as regras que também aparecem na documentação.
export class Usuario {
  constructor(dados) { Object.assign(this, dados); }
  ehTecnico() { return this.perfil === 'tecnico'; }
  podeConsultar(chamado) { return this.ehTecnico() || chamado.solicitante_id === this.id; }
}

export function texto(valor, nome, minimo, maximo) {
  if (typeof valor !== 'string' || valor.trim().length < minimo || valor.trim().length > maximo) {
    throw new Error(`${nome} deve ter entre ${minimo} e ${maximo} caracteres.`);
  }
  return valor.trim();
}

export class Chamado {
  constructor(dados) { Object.assign(this, dados); }
  static validar(dados) {
    const titulo = texto(dados.titulo, 'Título', 5, 100);
    const descricao = texto(dados.descricao, 'Descrição', 10, 2000);
    if (!['Computador', 'Internet', 'Impressora', 'Sistema', 'Outro'].includes(dados.categoria)) throw new Error('Categoria inválida.');
    if (!['Baixa', 'Média', 'Alta'].includes(dados.prioridade)) throw new Error('Prioridade inválida.');
    return { titulo, descricao, categoria: dados.categoria, prioridade: dados.prioridade };
  }
  iniciar(usuario) {
    if (!usuario.ehTecnico()) throw new Error('Somente técnicos podem iniciar atendimentos.');
    if (this.status !== 'Aberto') throw new Error('Este chamado já foi assumido ou concluído.');
    this.status = 'Em atendimento';
    this.tecnico_id = usuario.id;
  }
  concluir(usuario, solucao) {
    if (!usuario.ehTecnico() || this.tecnico_id !== usuario.id) throw new Error('Somente o técnico responsável pode concluir.');
    if (this.status !== 'Em atendimento') throw new Error('Inicie o atendimento antes de concluir.');
    this.solucao = texto(solucao, 'Solução', 10, 2000);
    this.status = 'Concluído';
  }
}

export class Mensagem {
  constructor(conteudo) { this.conteudo = texto(conteudo, 'Mensagem', 1, 1000); }
}
