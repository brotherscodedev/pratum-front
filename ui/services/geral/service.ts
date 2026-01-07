import http, { BasicResponseType, handleUri } from "@/services/http";
import { CidadeResponseType, PosteResponseType } from "./types";

class GeralService {
  getCidade = async (id: number) => {
    try {
      const uri = handleUri("/geral/cidade/" + id);
      const response = await http.get<CidadeResponseType>(
        `/api/backend?uri=${uri}`
      );
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar a cidade`);
    }
  };

  getCidades = async () => {
    try {
      const uri = handleUri("/geral/cidades/");
      const response = await http.get<BasicResponseType[]>(
        `/api/backend?uri=${uri}`
      );
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar as cidades`);
    }
  };

  getOcupante = async () => {
    try {
      const uri = handleUri("/concessionaria/ocupantes");
      const response = await http.get<BasicResponseType[]>(
        `/api/backend?uri=${uri}`
      );
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar as empresas`);
    }
  };

  getPostes = async (codigoIbge: string) => {
    try {
      const uri = handleUri("/geral/postes/" + codigoIbge);
      const response = await http.get<PosteResponseType[]>(
        `/api/backend?uri=${uri}`
      );
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar a cidade`);
    }
  };
}

export default new GeralService();
