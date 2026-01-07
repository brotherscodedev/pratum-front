import http, {
  PageRequestType,
  PagedResponseType,
  handleUri,
} from "@/services/http";
import {
  ArquivoRequestType,
  ProjetoCreateRequestType,
  ProjetoCreateResponseType,
  ProjetoGeralInteracao,
  ProjetoPosteType,
  ProjetoResponseType,
  ProjetosConcessionariaResponseType,
  ProjetoType,
} from "./types";
import { ArquivoType } from "@/services/http/types";
import { ar, id } from "date-fns/locale";
import { mockInteracoes } from "@/constants/data";

class ProjetoService {
  getProjetos = async (page: PageRequestType, filters?: object) => {
    try {
      const uri = handleUri("/ocupante/projetos", filters, page);
      const response = await http.get<PagedResponseType<ProjetoType>>(
        `/api/backend?uri=${uri}`
      );
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar as Projetos`);
    }
  };

  createProjeto = async (
    projeto: ProjetoCreateRequestType
  ): Promise<ProjetoCreateResponseType> => {
    try {
      const uri = handleUri("/ocupante/projeto");
      const response = await http.post<ProjetoCreateResponseType>(
        `/api/backend?uri=${uri}`,
        projeto
      );
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível gravar o Projeto`);
    }
  };

  getProjeto = async (id: number) => {
    try {
      const uri = handleUri("/ocupante/projeto/" + id);
      const response = await http.get<ProjetoResponseType>(
        `/api/backend?uri=${uri}`
      );
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar o Projeto`);
    }
  };

  addPoste = async (projetoId: number, codigoPoste: string) => {
    try {
      const uri = handleUri(
        "/ocupante/projeto/" + projetoId + "/poste/" + codigoPoste
      );
      const response = await http.post<ProjetoPosteType>(
        `/api/backend?uri=${uri}`
      );
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível adicionar o poste ao Projeto`);
    }
  };

  submeterProjeto = async (projetoId: number, status: string) => {
    try {
      const uri = handleUri("/ocupante/projeto/" + projetoId);
      const response = await http.put<ProjetoType>(`/api/backend?uri=${uri}`, {
        id: projetoId,
        status,
      });
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível gravar o Projeto`);
    }
  };

  removePoste = async (projetoId: number, codigoPoste: string) => {
    try {
      const uri = handleUri(
        "/ocupante/projeto/" + projetoId + "/poste/" + codigoPoste
      );
      const response = await http.delete(`/api/backend?uri=${uri}`);
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível remover o poste do Projeto`);
    }
  };

  savePoste = async (projetoId: number, projetoPoste: ProjetoPosteType) => {
    try {
      const uri = handleUri(
        "/ocupante/projeto/" + projetoId + "/poste/" + projetoPoste.codigoPoste
      );
      const response = await http.put(`/api/backend?uri=${uri}`, projetoPoste);
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível alterar o poste do Projeto`);
    }
  };

  addArquivo = async (projetoId: number, arquivo: ArquivoRequestType) => {
    try {
      const uri = handleUri("/ocupante/projeto/" + projetoId + "/arquivo");
      const response = await http.post<ArquivoType>(
        `/api/backend?uri=${uri}`,
        arquivo
      );
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível adicionar o arquivo ao Projeto`);
    }
  };

  removeArquivo = async (projetoId: number, arquivoId: number) => {
    try {
      const uri = handleUri(
        "/ocupante/projeto/" + projetoId + "/arquivo/" + arquivoId
      );
      const response = await http.delete(`/api/backend?uri=${uri}`);
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível remover o arquivo do Projeto`);
    }
  };

  getProjetosConcessionaria = async (
    page: PageRequestType,
    filters?: object
  ) => {
    try {
      const uri = handleUri("/concessionaria/projetos", filters, page);
      const response = await http.get<
        ProjetosConcessionariaResponseType<ProjetoType>
      >(`/api/backend?uri=${uri}`);
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar as Projetos`);
    }
  };

  analisarProjeto = async (projetoId: number) => {
    try {
      const uri = handleUri(`/concessionaria/projeto/${projetoId}/analisar`);
      const response = await http.post(`/api/backend?uri=${uri}`);
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar as Projetos`);
    }
  };

  getProjetoAnalisar = async () => {
    try {
      const uri = handleUri("/concessionaria/projeto-a-analisar");
      const response = await http.get<ProjetoType>(`/api/backend?uri=${uri}`);
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar o Projeto`);
    }
  };

  getProjetoConcessionaria = async (id: number) => {
    try {
      const uri = handleUri(`/concessionaria/projeto/${id}`);
      const response = await http.get<ProjetoResponseType>(
        `/api/backend?uri=${uri}`
      );
      console.log(response)
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar o Projeto`);
      
    }
  };

  postSalvarStatus = async (id: number, status: string, motivo ?: string) => {
    try {
      const uri = handleUri(`/concessionaria/projeto/${id}/status`);
      const response = await http.post(`/api/backend?uri=${uri}`, {
        status,
        motivo,
      });
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar o Projeto`);
    }
  };

  cancelarProjeto = async (id: number | undefined) => {
    try {
      if (!id) {
        throw new Error(`Não foi possível cancelar o Projeto`);
      }
      const uri = handleUri(`/ocupante/projeto/${id}/cancelar`);
      const response = await http.post(`/api/backend?uri=${uri}`);
      return response.data;
    } catch (ex) {
      throw new Error(`Não foi possível carregar o Projeto`);
    }
  };

  exportarPontos = async (id: number | undefined, userType: string) => {
    const uri = handleUri(`/${userType}/projeto/${id}/exportar-pontos`);
    const response = await http.get(`/api/backend?uri=${uri}`, {
      responseType: "blob", // important
    });
    // get file content
    const url = window.URL.createObjectURL(response.data);

    // get original file name
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'Prontos_Projeto_'+id+'.csv';
    if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch.length === 2)
            fileName = fileNameMatch[1];
    }
    return {url, fileName};
    // create file link in browser's memory
    // const obj = URL.createObjectURL(response.data);
    // obj.se
    // return obj;
  };

  // NOVA END POINT AGUARDANDO BACKEND
  getProjetoInterracao = async (id: number) => {
    try {
      const uri = handleUri(`/geral/projetos/${id}/interacoes`);
      const response = await http.get<ProjetoGeralInteracao>(
        `/api/backend?uri=${uri}`
      );
      return response.data;

      // array criado para testes caso queira simular como ficaram as mensagens
      //return mockInteracoes
    } catch (ex) {
      throw new Error(`Não foi possível carregar as interacoes do Projeto`);
    }
  };
}

export default new ProjetoService();
