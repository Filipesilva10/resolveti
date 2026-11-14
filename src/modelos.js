export class Usuario {
  constructor(dados) { Object.assign(this, dados); }
  ehTecnico() { return this.perfil === 'tecnico'; }
}

export class Chamado {
  static validar(dados) {
    if (typeof dados.titulo !== 'string' || dados.titulo.trim().length < 5 || dados.titulo.trim().length > 100) throw new Error('Título deve ter entre 5 e 100 caracteres.');
    if (typeof dados.descricao !== 'string' || dados.descricao.trim().length < 10 || dados.descricao.trim().length > 2000) throw new Error('Descrição deve ter entre 10 e 2000 caracteres.');
    if (!['Computador', 'Internet', 'Impressora', 'Sistema', 'Outro'].includes(dados.categoria)) throw new Error('Categoria inválida.');
    if (!['Baixa', 'Média', 'Alta'].includes(dados.prioridade)) throw new Error('Prioridade inválida.');
    return { titulo: dados.titulo.trim(), descricao: dados.descricao.trim(), categoria: dados.categoria, prioridade: dados.prioridade };
  }
}
