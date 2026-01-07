import http, { NoContentResponseType, PageRequestType, PagedResponseType, handleNoContentResponse, handleUri } from "@/services/http";
import { HistoricoNotificacao, NotificacaoResponseType } from "./types";

class NotificacaoService {
  getNotificacoes = async (page: PageRequestType, filters?: object) => {
    try {
      const uri = handleUri("/ocupante/notificacoes", filters, page);
      const response = await http.get<PagedResponseType<NotificacaoResponseType>>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao carregar as notificacoes: "+error)
      return []
    }
    
  }

  getNotificacaoById = async (notificacaoId: number) => {
    try {
      const uri = handleUri(`/ocupante/notificacoes/${notificacaoId}`);
      const response = await http.get<NotificacaoResponseType>(
        `/api/backend?uri=${uri}`
      );
      return response.data;    
    } catch (error) {
      console.log("Erro ao acessar uma notificacao: "+error)
      return null
    }
  };

  markRead = async (notificacaoId: number) => {
    try {
      const uri = handleUri(`/ocupante/notificacoes/${notificacaoId}/visualizar`);
      const response = await http.put<NoContentResponseType>(`/api/backend?uri=${uri}`);
      handleNoContentResponse(response.data);  
    } catch (error) {
      console.log("Erro ao marcar a notificacao como lida: "+error)
      return null
    }
  }

  respondNotification = async (data: {notificacaoId: number, mensagem: string, arquivos: any[]}) => {
    try {
      const uri = handleUri(`/ocupante/notificacoes/interacoes`);
      const response = await http.post<NoContentResponseType>(`/api/backend?uri=${uri}`, data);
      return response  
    } catch (error) {
      console.log("Erro ao Responder a Notificacacao: "+error)
      return null
    }
  }

  getHistoricoInteracoes = async (notificacaoId: number) => {
    try {
      const uri = handleUri(`/ocupante/notificacoes/${notificacaoId}/interacoes`);
      const response = await http.get<HistoricoNotificacao[]>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro mostrar o historico de interacoes: "+error)
      return []
    }
    
  }
}

export default new NotificacaoService();