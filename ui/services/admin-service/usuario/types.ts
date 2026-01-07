export type UsuarioServiceType = {
  id?: number
  nome: string;
  email: string;
  empresa: string;
  concessionria: string;
  perfil: string;
  situacao: "Ativo" | "Inativo";
  concessionaria ?: string;
  empresaOcuoante ?: string;
  telefone: string;
  modulos: "Atualização de Projetos" | "Normas e Resolução" | "Exclusão de Pontos" | "Faturamento" | "Multas" | "Notificação" | "Projetos" | "Relatórios" | "Inventário de Postes";
  cpf: string;
}

export type UsuarioHistorico = {
  id ?: number;
  data: string;
  situacaoAtual: "Ativo" | "Inativo";
  situacaoAnterior: "Ativo" | "Inativo";
  alteradoPor: string;
  empresaAtual: string;
  empresaAnterior: string;
}

export type Historico = {
  id ?: number;
  mensagens: UsuarioHistorico[]
}
