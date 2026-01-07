import { CidadeResponseType, PosteResponseType } from "@/services/geral/types";
import { AnotacaoType, ArquivoType, PagedResponseType } from "@/services/http/types";
import { Cidade } from "@/types";
import { boolean } from "zod";

export type ProjetoCreateRequestType = {
  descricao: string;
  cidadeId: number;
  //TODO arquivos
};

export type ProjetoCreateResponseType = {
  id: number;
  descricao: string;
  cidadeId: number;
};

export type EmpresaOcupanteType = {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  emailPrincipal: string;
  celularPrincipal: string;
  endereco: string;
  contratoURL: string;
};

export type AnalistaType = {
  id: number;
  name: string;
  email: string;
}

export type ProjetoType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  cidadeId: number;
  descricao: string;
  status: string;
  protocolo?: string;
  arquivos: ArquivoType[];
  anotacoes: AnotacaoType[];
  cidade: CidadeResponseType;
  empresaOcupante: EmpresaOcupanteType;
  dataSubmissao?: string;
  dataParecer?: string;
  analista?: AnalistaType;
  quantidadeDePontos: number;
  habilitadoParaAnalise ?: boolean;
};

export type NotificacaoType = {
  id: number;
  empresaId: number,
  cidadeId: number,
  tipoId: number,
  prazo: number,
  maximoInteracoes: number,
  motivo: string,
  status: string
};

export const ProjetoStatusRascunho = "RA";
export const ProjetoStatusAnalise = "AN";
export const ProjetoStatusReprovado = "RE";
export const ProjetoStatusAprovado = "AP";
export const ProjetoStatusPausado = "PA";
export const ProjetoStatusCancelado = "CA";
export const ProjetoStatusEmFila = "FI";

export type ProjetoPosteType = {
  id?: number;
  codigoPoste: string;
  equipamento: boolean;
  esforcoMecanico: boolean;
  subteranea: boolean;
  poste?: PosteResponseType;
};

export type ProjetoResponseType = {
  canPauseProject: boolean;
  projeto: ProjetoType;
  postes: ProjetoPosteType[];
};

export type ArquivoRequestType = {
  nome: string;
  tamanho: number;
  key: string;
  url: string;
};


export type ProjetosConcessionariaResponseType<T> = PagedResponseType<T> & {
  projetoAnaliseId: number;
}

export type ProjetoGeralInteracao = {
  id : number
  mensagem: string
  status: "RE" | "AN" | "FI" | "PA" | "CA" | "RA"
  data: Date | any
  usuario : {
    id: number
    name: string
  }

}