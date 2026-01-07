interface Cidade {
  id: number
  nome: string
  uf: string
  codigoIbge: string
  centroLat: string
  centroLon: string 
}

interface Poste {
  codigo: string
  lat: string
  lon: string
}

interface AnalistaOcupante{
  id: number
  name: string
  email: string
}

interface Projeto{
  id: number
  createdAt: Date
  descricao: string
  status: string
}

export type ExcluirPontoServiceType = {
  id: number
  data: Date
  cidade : Cidade
  status : "Enviado" | "EmAnalise" | "Pausado" | "Aprovado" | "Reprovado" 
  postes : Poste []
  analistaOcupante: AnalistaOcupante
  quantidadeDePontos : number
  projeto ?: Projeto
}

interface Usuario {
  id: number
  name: string        
  email: string
}

export interface Arquivo {
  id ?: number
  nome: string
  tamanho: number
  key: string
  url: string
}

export type Mensagem = {
  id: number
  mensagem: string
  data: Date
  usuario: Usuario
  arquivos ?: Arquivo []
}

export type Historico = {
  mensagens : Mensagem
}

export type Project = {
  projetoId : number
}

 export type ProjetoSaveSucessResponse = {
  id: number
  dataSolicitada: Date
  cidade : Cidade
  status : "Enviado" | "EmAnalise" | "Pausado" | "Aprovado" | "Reprovado" 
  postes : Poste []
  motivo : string
  analistaConcessionaria : AnalistaOcupante
  analistaOcupante: AnalistaOcupante
  quantidadeDePontos : number
  projeto ?: Projeto
}

export type Interaction = {
  exclusaoPontoId: number
  mensagem: string
  arquivos ?: Arquivo []
}

export type InteractionResponse = {
  id: number
  mensagem: string
  data : Date
  usuario : Usuario
  arquivos ?: Arquivo[]
}

export type Status = {
  status : "Enviado" | "EmAnalise" | "Pausado" | "Aprovado" | "Reprovado" 
  motivo : string
}

export type ExcluirPonto = {
  id: number
  dataSolicitada: Date
  cidade : Cidade
  status : "Enviado" | "EmAnalise" | "Pausado" | "Aprovado" | "Reprovado" 
  postes : Poste []
  analistaConcessionaria: AnalistaOcupante
  analistaOcupante: AnalistaOcupante
  quantidadeDePontos : number
  projeto ?: Projeto
}

export type ExclusaoPointTwo = {
  cidadeId : number
  posteCodigos : string []
  arquivos : Arquivo []
}


export type ExclusaoPointTwoResponse = {
  id : number
  dataSolicitada : Date
  cidade : Cidade
  status : "Enviado" | "EmAnalise" | "Pausado" | "Aprovado" | "Reprovado" 
  postes : Poste[]
}

export type Erro = {
  code: string
  error: string
  message: string
  success: boolean 
}