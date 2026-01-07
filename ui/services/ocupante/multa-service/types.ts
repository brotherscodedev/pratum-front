export type MultaResponseType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  motivo: string;
  vencimento: string;
  valor: number;
  empresaOcupanteId: number;
  arquivo: {
    id: number,
    updatedAt: string,
    createdAt: string,
    nome: string,
    tamanho: number
    key: string,
    url: string,
  }
};