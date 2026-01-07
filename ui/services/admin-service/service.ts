import http, { handleUri, PageRequestType } from "@/services/http";
import { ConcessionariaType, PontosResponseType } from "./types";
import { Poste } from "@/types";

class AdminService {
  getConcessionarias = async () => {
    try {
      const uri = handleUri("/admin/concessionarias");
      const response = await http.get<ConcessionariaType[]>(
        `/api/backend?uri=${uri}`
      );
      return response.data;
    } catch (error) {
      return [];
    }
  };

  getAllPontos = async (filters?: object) => {
    try {
      const uri = handleUri("/admin/pontos-todos", filters);
      const response = await http.get<Poste[]>(`/api/backend?uri=${uri}`);
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar os pontos`);
    }
  };

  sendFile = async (file: any) => {
    var formData = new FormData();
    formData.append("file", file);
    http.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  
  buscarPontos = async (page: PageRequestType, filtros: object) => {
    try {
      const uri = handleUri("/admin/pontos-todos", filtros); 
      const response = await http.post<PontosResponseType<Poste>>(
        `/api/backend-paginado?uri=${uri}`,
        page
      );
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar pontos paginados");
    }
  };
} 

export default new AdminService();
