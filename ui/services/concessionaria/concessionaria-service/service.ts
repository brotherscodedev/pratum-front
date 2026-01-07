import http, { handleUri } from "@/services/http";
import { OcupanteBasicResponseType } from "./types";

class ConcessionariaService {
  getOcupantes = async () => {
    try {
      const uri = handleUri("/concessionaria/ocupantes");
      const response = await http.get<OcupanteBasicResponseType[]>(`/api/backend?uri=${uri}`);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  getAnalistas = async () => {
    try {
      const uri = handleUri("/concessionaria/analistas");
      const response = await http.get<OcupanteBasicResponseType[]>(`/api/backend?uri=${uri}`);
      return response.data;
    } catch (error) {
      return [];
    }
  }
}

export default new ConcessionariaService();