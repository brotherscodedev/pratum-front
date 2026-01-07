import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { DescricaoId } from "@/types";
import { format } from "date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";


type FormatDateType = "short" | "long" | "complete";

const FORMAT_DATE_MAP = {
  short: "dd/MM/yyyy",
  long: "EEEEEE, dd MMMM yyy",
  complete: " EEEE',' dd 'de' MMMM 'de' yyyy",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(d: string | undefined | null): string | null {
  
  if(d ===  null) return "Pendente"

  if (!d) return "";
  
  const date = new Date(d);
  
  // Verifica se a data é válida antes de formatar
  if (isNaN(date.getTime())) {
    return "Data inválida";
  }
  
  return (
    date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR")
  );
}

export function formatDate(
  d: string | undefined,
  type: FormatDateType = "short"
): string {
  if (!d) return "";

  const date = new Date(d);
  
  // Verifica se a data é válida antes de formatar
  if (isNaN(date.getTime())) {
    return "Data inválida";
  }
  
  return format(date, FORMAT_DATE_MAP[type], {
    locale: ptBrLocale,
  });
}

export type FormatDateTypeTwo = "short" | "long" | "short_date"; // exemplo

export const FORMAT_DATE_MAP_TWO = {
  short: "dd/MM/yyyy HH:mm:ss",
  long: "PPPPpppp",
  short_date: "dd/MM/yyyy"
};

export function formatDateTwo(
  d: string | undefined | null | Date ,
  type: FormatDateTypeTwo = "short"
): string {

  if(d === null || d === undefined) return "Pendente"

  if (!d) return "";

  let date: Date;
  
  if (d instanceof Date) {
    date = d;
  } else {
    // Remove o 'Z' do final para evitar conversão para UTC
    const localDateStr = d.replace(/Z$/, "");
    // Cria o Date interpretando como local
    date = new Date(localDateStr);
  }

  // Verifica se a data é válida antes de formatar
  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  return format(date, FORMAT_DATE_MAP_TWO[type], {
    locale: ptBrLocale,
  });
}

let brlFormater = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatValor(d: number): string {
  if (!d) return "";

  return brlFormater.format(d / 100);
}

export function formatDateApi(d: Date): string | null {
  if (!d) return null;
  return d.toISOString().split("T")[0];
}

export function descricaoIdToMap(v: DescricaoId[] | null): Map<number, string> {
  const m: Map<number, string> = new Map();
  if (!v) return m;
  v.forEach((d) => m.set(d.id, d.descricao));
  return m;
}

export function formatCurrency(centavos: number): string {
  const valor = centavos / 100;
  return valor.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

export function formatCNPJ(cnpj: string) {
  if (!cnpj) return;

  const cleanedValue = cnpj.replace(/\D/g, "");

  return cleanedValue
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function validateCNPJ(cnpj: string) {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]+/g, "");

  // Verifica se o CNPJ tem 14 dígitos
  if (cnpj.length !== 14) {
    return false;
  }

  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false;
  }

  // Validação do segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false;
  }

  return true;
}

export const formatSize = (bytes?: number) => {
  if (!bytes) return "0 B";

  const kb = bytes / 1024;
  const mb = bytes / 1024 / 1024;
  const gb = bytes / 1024 / 1024 / 1024;

  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  if (kb >= 1) return `${kb.toFixed(1)} KB`;

  return `${bytes} B`;
};

type stringObj = { [key: string]: string };

export const statusProjetoMap: stringObj = {
  RA: "Rascunho",
  AN: "Em Análise",
  RE: "Reprovado",
  AP: "Aprovado",
  PA: "Pausado",
  CA: "Cancelado",
  FI: "Em Fila"
};


export const statusExclusaoPontosFiltro: stringObj = {
  ENVIADO: "Enviado",
  EM_ANALISE: "EmAnalise",
  PAUSADO: "Pausado",
  REPROVADO: "Reprovado",
  APROVADO: "Aprovado",
};

export const perfilUsuarioFiltro: stringObj = {
GestorConcessionária: "Gestor Concessionária",
GerenteConcessionária: "Gerente Concessionária",
CoordenadorConcessionária: "Coordenador Concessionária",
AnalistaConcessionária: "Analista Concessionária",
TécnicoConcessionaria: "Técnico Concessionaria",
GestorOcupante: "GestorOcupante",
GerenteOcupante: "Gerente Ocupante",
CoordenadorOcupante: "Coordenador Ocupante",
AnalistaOcupante: "Analista Ocupante",
TécnicoOcupante: "Técnico Ocupante"
};
