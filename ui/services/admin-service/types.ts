import { Poste } from "@/types";
import { PagedResponseType } from "../http";


export type ConcessionariaType = {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  celular: string;
  endereco: string;
};





export type PontosResponseType<T> = PagedResponseType<T>;