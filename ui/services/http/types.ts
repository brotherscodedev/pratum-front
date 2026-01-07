export type PageRequestType = {
  limit: number;
  page: number;
}

export type PagedResponseType<T> = {
  limit: number;
  page: number;
  count: number;
  existeNaoLida?: boolean;
  data: T[];
}

export type BasicResponseType = {
  id: number;
  descricao: string;
}

export type NoContentResponseType = {
  message: string;
  success: boolean;
  error?: string;
  code?: string;
};

export type ArquivoType = {
  id: number;
  updatedAt: string;
  createdAt: string;
  nome: string;
  tamanho: number;
  key: string;
  url: string;
}

export type AnotacaoType = {
  id: number;
  updatedAt: string;
  createdAt: string;
  descricao: string;
  novoStatus: string;
}
