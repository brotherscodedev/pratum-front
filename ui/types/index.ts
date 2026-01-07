import { Icons } from "@/components/icons";
import { UserType } from "@/constants/siga";
import { ColumnDef } from "@tanstack/react-table";
import { number } from "zod";

export type SetVoid = () => void
export type SetString = (value: string) => void
export type SetNumber = (value: number) => void
export type SetBoolean = (value: boolean) => void

export type Usuario = {
  id: number;
  name: string;
  email: string;
  type: UserType;
  empresaOcupanteId?: number;
  concessionariaId?: number;
};

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type PesquisaResponse<T> = {
  limit: number;
  offset: number;
  count: number;
  data: T[];
};

export type Colunas<T> = ColumnDef<T>[];

export type Notificacao = {
  id: number;
  motivo: string;
  cidadeId: number;
  prazo: string;
  dataEnviada: Date;
  dataPrazo: Date;
  status: string;
  tipo:{
    id: number,
    tipo: string,
    permiteInteracao: boolean
  }
  reponsavel: any
};


export type Documento = {
  id: number;
  nome: string;
  tipo: string;
  arquivo: {
    tamanho: number;
    nome: string;
    key: string;
    url: string;
  };
};

export type DescricaoId = {
  id: number;
  descricao: string;
};

export type ApiResponse = {
  message: string;
  success: boolean;
  error?: string;
  code?: string;
};

export type Cidade = {
  id: number;
  nome: string;
  uf: string;
  codigoIbge: string;
  centroLat: string;
  centroLon: string;
};

export type Poste = {
  codigo: string;
  cidadeCodigo: string;
  lat: string;
  lon: string;
  situacao: "D" | "N" | "P";
  possuiEquipamento: boolean;
  possuiEMS: boolean;
  descidaSub: boolean;
  caracteristicas: string
  concessionariaId: number;
  altura ?: number
  esforco ?: number
  material ?: string
  estrutura ?: string
  ocupantes ?: number
  empresasOcupantes ?: string []
};

export type ProjetoPoste = {
  id?: number;
  codigoPoste: string;
  equipamento: boolean;
  esforcoMecanico: boolean;
  subteranea: boolean;
};

interface AnalistaOcupante{
  id: number
  name: string
  email: string
}

export type ExcluirPontos = {
  dataSolicitada: string | number | Date;
  dataParecer: string | number | Date;
  id : number;
  motivo: string
  nomeProjeto : string;
  municipio : string;
  nomeCidade : string;
  quantidadePontos : number;
  dataSolicitacao : Date;
  situacao : string;
  status: string;
  analistaConcessionaria: AnalistaOcupante
  analistaOcupante: AnalistaOcupante
}


export type ExcluirPontosFiltro = {
  nomeProjeto : string;
  exclusaoId: string
  status: string | null;
  nomeCidade : string;
  quantidadePontos : number | null;
  dataSolicitacao : Date | null;
  nomeEmpresa ?: string;
  ocupante ?: string;
  descricaoProjeto ?: string
}

interface Arquivo{
  nome: string
  tamanho: number
  key: string
  url: string
}

export type ExcluirPontosEntrada = {
  cidadeId: number;
  posteCodigos: string [];
  arquivos: Arquivo [];
}

interface PosteExcluirPontosEntrada {
  codigo : string;
  lat : string;
  lon: string;
}

// Tavez nao precise revisar posteriormente
export type ExcluirPontosSaida = {
  id: number;
  dataSolicitada: Date
  cidade: Cidade;
  status: string;
  postes: PosteExcluirPontosEntrada []
}

export type atualizarStatusExclusaoPontos = {
  status: "EmAnalise" | "Pausado" | "Aprovado" | "Reprovado";
  motivo: string;
}

export type usuariosFiltro = {
  ocupante: string;
  perfil: "" | "Gestor Concessionária" | "Gerente Concessionária" | "Coordenador Concessionária" | "Analista Concessionária" | "Técnico Concessionaria" | "Gestor Ocupante" | "Gerente Ocupante" | "Coordenador Ocupante" | "Analista Ocupante" | "Técnico Ocupante"
  cpf:  "" | string  ;
  concessionaria: string;
  situacao ?: "" | "Ativo" | "Inativo";
}

export type usuariosListados = {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  concessionaria: string;
  perfil: "" | "Gestor Concessionária" | "Gerente Concessionária" | "Coordenador Concessionária" | "Analista Concessionária" | "Técnico Concessionaria" | "Gestor Ocupante" | "Gerente Ocupante" | "Coordenador Ocupante" | "Analista Ocupante" | "Técnico Ocupante";
  situacao: "Ativo" | "Inativo";
}