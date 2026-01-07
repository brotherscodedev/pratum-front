import http, { handleUri, PagedResponseType } from "../http";
import { CidadeBasicResponseType, CidadeResponseType } from "./types";

class CidadeService {
  getCidadesBasicList = async () => {
    try {
      const uri = handleUri("/geral/cidades");
      const response = await http.get<CidadeBasicResponseType[]>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao buscar cidade: "+error)
      return []
    }
  }

  getCidadesPorCodigo = async () => {
    try {
      const uri = handleUri("/geral/cidades-por-codigo");
      const response = await http.get<CidadeResponseType[]>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Buscar Cidades pelo codigo: "+error)
      return []
    }
    
  }
}

export default new CidadeService();