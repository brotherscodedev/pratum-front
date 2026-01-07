import http, { NoContentResponseType, PageRequestType, PagedResponseType, handleNoContentResponse, handleUri } from "@/services/http";
import { NotificacaoResponseType } from "./types";
import { HistoricoNotificacao } from "@/services/ocupante/notficacoes-service/types";

class NotificacaoService {
  getNotificacoes = async (page: PageRequestType, filters?: object) => {
    try {
      const uri = handleUri("/concessionaria/notificacoes", filters, page);
      const response = await http.get<PagedResponseType<NotificacaoResponseType>>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao carregar as notificacoes: "+error)
      return []
    }
  }

  setNotificacoes = async (data: any, page?: PageRequestType, filters?: object) => {
    try {
      const uri = handleUri("/concessionaria/notificacoes", filters, page);
      const response = await http.post<PagedResponseType<NotificacaoResponseType>>(
        `/api/backend?uri=${uri}`,
        data
      );
      return response.data;  
    } catch (error) {
      console.log("Erro ao adicionar as notificacoes: "+error)
      return null
    }    
  };

  putNotificacoes = async (notificacaoId: any, data: Partial<NotificacaoResponseType>) => {
    try {
      const uri = handleUri(`/concessionaria/notificacoes/rascunhos/${notificacaoId}`);
      const response = await http.put<PagedResponseType<NotificacaoResponseType>>(
        `/api/backend?uri=${uri}`,
        data
      );
      return response.data;  
    } catch (error) {
      console.log("Erro ao atualizar as notificacoes")
      return null
    }
  };

  enviaNotificacao = async (notificacaoId: any) => {
    try {
      const uri = handleUri(`/concessionaria/notificacoes/rascunhos/${notificacaoId}/enviar`);
      const response = await http.put<PagedResponseType<NotificacaoResponseType>>(
        `/api/backend?uri=${uri}`,
      );
      return response.data;  
    } catch (error) {
      console.log("Erro ao atualizar as notificacoes: "+error)
      return null
    }    
  };

  getNotificacaoById = async (notificacaoId: number) => {
    try {
      const uri = handleUri(`/concessionaria/notificacoes/${notificacaoId}`);
      const response = await http.get<NotificacaoResponseType>(
        `/api/backend?uri=${uri}`
      );
      return response.data;  
    } catch (error) {
      console.log("Erro ao carregar uma nootificacao: "+error)
      return null
    }   
  };

  putConcluiInativaNotificacao = async (notificacaoId: any, data: Partial<NotificacaoResponseType>) => {
    try {
      const uri = handleUri(`/concessionaria/notificacoes/${notificacaoId}/status`);
      const response = await http.put<PagedResponseType<NotificacaoResponseType>>(
        `/api/backend?uri=${uri}`,
        data
      );
      return response.data;
    } catch (error) {
      console.log("Erro ao atualizar a notificacao: "+error)
      return null
    }
  };

  respondNotification = async (data: {notificacaoId: number, mensagem: string, arquivos: any[]}) => {
    try {
      const uri = handleUri(`/concessionaria/notificacoes/interacoes`);
      const response = await http.post<NoContentResponseType>(`/api/backend?uri=${uri}`, data);
      return response
    } catch (error) {
      console.log("Responder Notificacao: "+error)
      return null
    }
  }

  getHistoricoInteracoes = async (notificacaoId: number) => {

    try {
      const uri = handleUri(`/concessionaria/notificacoes/${notificacaoId}/interacoes`);
      const response = await http.get<HistoricoNotificacao[]>(`/api/backend?uri=${uri}`)
      return response.data
    } catch (error) {
      console.log("Erro ao carregar o historico de interacoes: "+error)
      return []
    }
        
  }
}

export default new NotificacaoService();