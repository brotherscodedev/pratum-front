import http, { NoContentResponseType, handleNoContentResponse, handleUri } from "@/services/http";
import { AvisoResponseType } from './types';
import { Usuario } from "@/types";

class UsuarioService {
  getUsuarioLogado = async () => {
    try {
      const uri = handleUri("/usuario");
      const response = await http.get<Usuario>(`/api/backend?uri=${uri}`)
      return response.data
    } catch (ex) {
      throw new Error(`Não foi possível buscar o usuario`);
    }
  }

  getAvisosUsuario = async () => {
    try {
      const uri = handleUri("/usuario/avisos");
      const response = await http.get<AvisoResponseType[]>(`/api/backend?uri=${uri}`)
      return response.data
    } catch (ex) {
      throw new Error(`Não foi possível buscar os avisos`);
    }
  }

  markReadAvisoUsuario = async (avisoId: number) => {
    try {
      console.log(avisoId)
      const uri = handleUri(`/usuario/aviso/${avisoId}/lido`);
      const response = await http.post<NoContentResponseType>(`/api/backend?uri=${uri}`, {})
      handleNoContentResponse(response.data);
    } catch (ex) {
      throw new Error(`Não foi possível marcar o aviso como lido`);
    }
  }
}

export default new UsuarioService();