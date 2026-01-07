import http, {
  handleUri,
  NoContentResponseType,
  PageRequestType,
  PagedResponseType,
  handleNoContentResponse
} from "@/services/http";
import { MultaResponseType, MultaCreateRequestType } from './types';

class multaService {
  getMultas = async (page: PageRequestType, filters?: object) => {
    try {
      const uri = handleUri("/concessionaria/multas", filters, page);
      const response = await http.get<PagedResponseType<MultaResponseType>>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao carregar as multas: "+error)
      return []
    }
  }

  getMultaById = async (multaId: number) => {
    try {
      const uri = handleUri(`/concessionaria/multa/${multaId}`);
      const response = await http.get<MultaResponseType[]>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao buscar a multa: "+error)
      return  null  
    }
  }

  saveMulta = async (multa: MultaCreateRequestType) => {
    try {
      const uri = handleUri("/concessionaria/multa");
      const response = await http.post<NoContentResponseType>(`/api/backend?uri=${uri}`, multa);
      handleNoContentResponse(response.data);  
    } catch (error) {
      console.log("Erro ao Salvar Multa: "+error)
      return null
    }  
  }

  deleteMulta = async(multaId: number) => {
    try {
      const uri = handleUri(`/concessionaria/multa/${multaId}`);
      const response = await http.delete<NoContentResponseType>(`/api/backend?uri=${uri}`);
      handleNoContentResponse(response.data);  
    } catch (error) {
      console.log("Erro ao Deletar Multa: "+error)
      return null
    }
  }
}

export default new multaService()