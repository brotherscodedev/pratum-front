import http, { NoContentResponseType, handleNoContentResponse, handleUri } from "@/services/http";
import { OcupanteResponseType, UpdateProfileRequestType } from './types';

class ocupanteService {
  getLoggedProfile = async () => {
    try {
      const uri = handleUri("/ocupante/empresa");
      const response = await http.get<OcupanteResponseType>(`/api/backend?uri=${uri}`)
      return response.data  
    } catch (error) {
      console.log("Erro ao acessar os dados do usuario: "+error)
      return null
    }
    
  }

  saveLoggedProfile = async (ocupante: UpdateProfileRequestType) => {
    try {
      const uri = handleUri("/ocupante/empresa");
      await http.put<OcupanteResponseType>(`/api/backend?uri=${uri}`, ocupante);
    } catch (error) {
      console.log("Erro ao salvar o login "+error)
      return null
    }
    
  }
}

export default new ocupanteService();