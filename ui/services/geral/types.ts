import { AnotacaoType, ArquivoType } from "@/services/http/types";

export type CidadeResponseType = {
  id: number;
  nome: string;
  uf: string;
  codigoIbge: string;
  centroLat: string;
  centroLon: string;
};

export type PosteResponseType = {
  codigo: string;
  cidadeCodigo: string;
  lat: string;
  lon: string;
  situacao: "D" | "N" | "P";
  possuiEquipamento: boolean;
  equipamentoParticular: boolean;
  limitesPontosFixos: number;
  altura ?: number
  esforco ?: number
  material ?: string
  estrutura ?: string
  ocupantes ?: number
  empresasOcupantes ?: string []
};

export type PosteResponseType2 = {
  codigo: string;
  cidadeCodigo: string;
  lat: string;
  lon: string;
  situacao: "D" | "N" | "P";
  limitesPontosFixos: number;
  concessionariaId: number
}