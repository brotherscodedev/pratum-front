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
  Erro,
  PosteNovo
} from "./types";
import { sessionUser } from "@/lib/api-call";

class ExcluirPontoService {
  
  getExcluirPonto = async (page: PageRequestType, filters?: object) => {
    try {
      const uri = handleUri("/ocupante/exclusao-pontos", filters, page);
      const response = await http.get<PagedResponseType<ExcluirPonto> >(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao Listar Excluir Pontos: "+error)
      return []
    }
  }

  getExcluirPontoById = async (id: number) => {
    try {
      const uri = handleUri(`/ocupante/exclusao-pontos/${id}`);
      const response = await http.get<ExcluirPonto>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao Carregar um ponto pelo id: "+error)
      return null
    }
  }

  getHistorico = async (idExclusaoPonto : number) => {
    try {
      const uri = handleUri(`/ocupante/exclusao-pontos/${idExclusaoPonto}/interacoes`);
      const response = await http.get<Mensagem[]>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao carregar o historico: "+error)
      return []      
    }
  }

  // getPontosOcupante = async () => {
  //   const uri = handleUri(`/ocupante/exclusao-pontos/pontos`);
  //   const response = await http.get<any>(`/api/backend?uri=${uri}`)
  //   return response.data
  // }

   getPontosOcupante = async () => {
    try {
      const uri = handleUri(`/ocupante/pontos`);
      const response = await http.get<PosteNovo[]>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao carregar postes: "+error)
      return []
    }
  }

  saveInteraction = async (interaction : Interaction) => {
    try {
      const uri = handleUri( `/ocupante/exclusao-pontos/interacoes`);
      const response = await http.post<InteractionResponse[] | Erro>(`/api/backend?uri=${uri}`, interaction);
      return response.data  
    } catch (error) {
      console.log("Erro ao salvar a exclusao do poste: "+error)
      return null  
    }
    
  }

  saveRemovePoints = async ( exclusaoPointTwo : ExclusaoPointTwo) => {
    try {
      const uri = handleUri( `/ocupante/exclusao-pontos`);
      const response = await http.post<ExclusaoPointTwoResponse>(`/api/backend?uri=${uri}`, exclusaoPointTwo);
      return response.data  
    } catch (error) {
      console.log("Erro ao cadastrar o excluir pontos: "+error)
      return null
    }
  }

  saveRemovePointsByFile = async ( file: FormData ) => {
    try {
      const uri = handleUri( `/ocupante/exclusao-pontos/arquivos`);
      const response = await http.post<ExclusaoPointTwoResponse>(`/api/upload-exclusao?uri=${uri}`, file);
      return response.data  
    } catch (error) {
      console.log("Erro ao cadastrar o excluir pontos: "+error)
      return null
    }
  }

}

export default new ExcluirPontoService();