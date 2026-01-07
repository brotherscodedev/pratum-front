import http, { PageRequestType, PagedResponseType, handleUri, handleNoContentResponse, NoContentResponseType } from "@/services/http";
import { 
  Historico,
  UsuarioServiceType
} from "./types";
import { sessionUser } from "@/lib/api-call";
import { usuarioHistoricoMock, usuariosMocadosTeste, usuarioVazio } from "@/constants/data";

class UsuarioService {
  
  getUsuarios = async (page: PageRequestType, filters?: object) => {
    try {
      // const uri = handleUri("/ocupante/exclusao-pontos", filters, page);
      // const response = await http.get<PagedResponseType<UsuarioServiceType> >(`/api/backend?uri=${uri}`)
      
      return usuariosMocadosTeste  
    } catch (error) {
      console.log(error)
      console.log("Erro ao Listar Usuarios: ")
      return []
    }
  }

  getUsuarioById = async (id : number) => {
    try {
      // const uri = handleUri("/ocupante/exclusao-pontos", filters, page);
      // const response = await http.get<PagedResponseType<UsuarioServiceType> >(`/api/backend?uri=${uri}`)
      let aux = [] 
      aux = usuariosMocadosTeste.filter( (usuario) => usuario.id === id )
      if(aux.length === 0){
        return usuarioVazio
      } else{
        return aux[0]
      }

    } catch (error) {
      console.log(error)
      console.log("Erro ao Listar Usuarios: ")
      return []
    }
  }

  getHistoricoUsuarioById = async (id : number) => {
    try {
      // const uri = handleUri("/ocupante/exclusao-pontos", filters, page);
      // const response = await http.get<PagedResponseType<UsuarioServiceType> >(`/api/backend?uri=${uri}`)
      let aux = [] 
      aux = usuarioHistoricoMock.filter( (usuario ) => usuario.id === id )
      
      if(aux.length === 0){
        return []
      } else{
        return aux[0]
      }

    } catch (error) {
      console.log(error)
      console.log("Erro ao Listar Usuarios: ")
      return []
    }
  }

}

export default new UsuarioService();