import http, { PageRequestType, PagedResponseType, handleUri } from "@/services/http";
import { MultaResponseType } from "./types";

class MultaService {
  getMultas = async (page: PageRequestType, filters?: object) => {
    try {
      const uri = handleUri("/ocupante/multas", filters, page);
      const response = await http.get<PagedResponseType<MultaResponseType>>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao carregar multas: "+error)
      return []
    }
  }
}

export default new MultaService();