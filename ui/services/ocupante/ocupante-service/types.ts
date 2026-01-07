import { BasicResponseType } from "@/services/http/types";

export type OcupanteBasicResponseType = BasicResponseType;

export type OcupanteResponseType = {
  id: number;
  createdAt?: string;
  nomeFantasia: string;
  razaoSocial?: string;
  updatedAt?: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  emailPrincipal?: string;
  celularPrincipal?: string;
  endereco?: string;
  contratoURL?: string;
}

export type UpdateProfileRequestType = {
  nomeFantasia: string;
  razaoSocial: string;
  cnpjCpf: string;
  inscricaoEstadual: string;
  emailPrincipal: string;
  celularPrincipal: string;
  endereco: string;
}