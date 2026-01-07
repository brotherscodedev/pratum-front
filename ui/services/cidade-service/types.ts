import { BasicResponseType } from "../http";

export type CidadeBasicResponseType = BasicResponseType;

export type CidadeResponseType = {
  codigoIbge: string;
  nome: string;
  id: number;
  centroLat: string;
  centroLon: string;
};