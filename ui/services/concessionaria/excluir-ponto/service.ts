import http, { PageRequestType, PagedResponseType, handleUri, handleNoContentResponse, NoContentResponseType } from "@/services/http";
import { 
  ExcluirPontoServiceType ,
  Project, 
  ProjetoSaveSucessResponse, 
  Interaction, 
  InteractionResponse, 
  Status, 
  Mensagem, 
  ExcluirPonto, 
  ExclusaoPointTwo,
  ExclusaoPointTwoResponse,
  Erro
} from "./types";
import { atualizarStatusExclusaoPontos } from "@/types";

class ExcluirPontoService {
  getExcluirPonto = async (page: PageRequestType, filters?: object) => {
    const uri = handleUri("/concessionaria/exclusao-pontos", filters, page);
    const response = await http.get<PagedResponseType<ExcluirPonto> >(`/api/backend?uri=${uri}`)
    return response.data
  }

   getExcluirPontoById = async (id: number) => {
      try {
        const uri = handleUri(`/concessionaria/exclusao-pontos/${id}`);
        const response = await http.get<ExcluirPonto>(`/api/backend?uri=${uri}`)
        return response.data  
      } catch (error) {
        console.log("Ërro ao carregar um ponto pelo ID: "+error)
        return null
      }
      
    }

  getHistorico = async (idExclusaoPonto : number) => {
    try {
      const uri = handleUri(`/concessionaria/exclusao-pontos/${idExclusaoPonto}/interacoes`);
      const response = await http.get<Mensagem[]>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao carregar o historico"+error)
      return []
    }
  }

  saveInteraction = async (interaction : Interaction) => {
    try {
      const uri = handleUri( `/concessionaria/exclusao-pontos/interacoes`);
      const response = await http.post<InteractionResponse[] | Erro>(`/api/backend?uri=${uri}`, interaction);
      return response.data  
    } catch (error) {
      console.log("Erro ao salvar interacao:" +error)
      return null
    }    
  }

  atualizarStatusExclusaoPontos = async ( exclusao_id: number, exclusaoPointTwo : atualizarStatusExclusaoPontos) => {
    try {
      const uri = handleUri( `/concessionaria/exclusao-pontos/${exclusao_id}/status`);
      const response = await http.put<ExclusaoPointTwoResponse>(`/api/backend?uri=${uri}`, exclusaoPointTwo);
      return response.data    
    } catch (error) {
      console.log("Erro ao salvar interacao:" +error)
      return null
    }
  }
  saveRemovePoints = async ( exclusaoPointTwo : ExclusaoPointTwo) => {
    try {
      const uri = handleUri( `/concessionaria/exclusao-pontos`);
      const response = await http.post<ExclusaoPointTwoResponse>(`/api/backend?uri=${uri}`, exclusaoPointTwo);
      return response.data  
    } catch (error) {
      console.log("Erro ao salvar exclusao de pontos: " +error)
      return null
    }
    
  }

  aditionProjectInPoint = async ( projeto : Project ) => {
    try {
      const uri = handleUri( `/concessionaria/exclusao-pontos/${projeto.projetoId}/projetos`);
      const response = await http.put<ProjetoSaveSucessResponse | Erro>(`/api/backend?uri=${uri}`, projeto);
      return response.data  
    } catch (error) {
      console.log("Erro ao adicionar ponto no projeto: "+error)
      return null
    }
    
  }

}

export default new ExcluirPontoService();