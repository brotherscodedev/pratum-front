export type NotificacaoResponseType = {
  id: number;
  motivo: string;
  cidade: {
    id: number;
    nome: string;
    uf: string;
    codigoIbge: string;
    centroLat: string;
    centroLon: string;
  };
  empresa: {
    id: number;
    nomeFantasia: string;
    razaoSocial: string;
  };
  tipo: {
    id: number;
    tipo: string;
    permiteInteracao: boolean;
  };
  dataEnviada: string;
  dataVisualizada: string | null;
  dataPrazo: string;
  prazo: number;
  status: string;
  maximoInteracoes: number;
  arquivos: {
    id: number;
    nome: string;
    tamanho: number;
    key: string;
    url: string;
  }[];
  solicitante: {
    id: number;
    name: string;
    email: string;
  };
  responsavel: {
    id: number;
    name: string;
    email: string;
  } | null;
};
