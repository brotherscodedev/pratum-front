"use client"
import { Icons } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicResponseType, PagedResponseType } from "@/services/http";
import {
  Colunas,
  ExcluirPontos,
  ExcluirPontosFiltro,
} from "@/types";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import useAsync from "@/hooks/useAsync";
import { FiltrosNotificacaoType } from "../notificacoes/types";
import { Grid } from "@/components/crud/grid";
import ActionBar, { ActionBarItemType } from "@/components/action-bar";
import IconGfonts from "@/components/icon-gfonts/icon";
import { Pesquisa } from "@/components/crud/pesquisa";
import { FiltrosExcluirPontos } from "./filtros";
import { toast } from "@/components/ui/use-toast";
import geralService from "@/services/geral";
import { formatDateApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { HistoryEmptyModal } from "@/components/modal/history-empty-modal";
import HistoryOrChatRemovePoints from "@/components/modal/history-remove-point";
import  {mokHistorico, excluirPontosMock}   from "@/constants/data";
import ExcluirPontoService from "@/services/concessionaria/excluir-ponto";
import { ExcluirPonto } from "@/services/concessionaria/excluir-ponto/types";
import { UsuarioContext } from "@/app/context";
import concessionariaService from "@/services/concessionaria/concessionaria-service";


const breadcrumbItems = [{ title: "Exclusão de Pontos", link: "/concessionaria/excluir-pontos" }];

export default function page() {


   const colunas: Colunas<ExcluirPontos> = [
    {
      accessorKey: "id",
      header: "ID Exclusão",
    },
    {
      accessorKey: "empresaOcupante.nomeFantasia",
      header: "Ocupante",
    },
    // {
    //   accessorKey: "nomeProjeto",
    //   header: "Nome do Projeto",
    // },
    // {
    //   accessorKey: "cidade.nome",
    //   header: "Município",
    // },
    {
      accessorKey: "quantidadePontos", //quantidadeDePontos
      header: "Quant. de Pontos",
      cell: ({ row }) => {
        return row.original.quantidadePontos || 0;
      },
    },
    {
      accessorKey: "dataSolicitada",
      header: "Data da Solicitação",
      cell: ({ row }) => {
        const dataEnviada = new Date(row.original.dataSolicitada);
        return dataEnviada.toLocaleDateString("pt-BR");
      },
    },
    {
      accessorKey: "dataParecer",
      header: "Data Parecer",
      cell: ({ row }) => {
        if(row.original.dataParecer === undefined){
          return "Pendente"
        } else{
          const dataEnviada = new Date(row.original.dataParecer);
          return dataEnviada.toLocaleDateString("pt-BR");
        }
      },
    },
    {
      accessorKey: "status", 
      header: "Situação",
    },
    {
      id: "actions",
      cell: ({ row }) => renderActions(row.original),
    },
  ];
  const router = useRouter()
  const user = useContext(UsuarioContext);
  const [excluirPontos, setExcluirPontos] = useState<ExcluirPonto[]>([])
  const [count, setCount] = useState<number>(0) // excluirPontosMock
   // excluirPontosMock  <ExcluirPonto[] | null>
  const [municipios, setMunicipios] = useState<BasicResponseType[]>([]);
  const [filtros, setFiltros] = useState<ExcluirPontosFiltro>({
    nomeProjeto : "",
    nomeCidade : "",
    exclusaoId: "",
    quantidadePontos : null,
    dataSolicitacao : null,
    status : null,
    ocupante: "",
    nomeEmpresa: ""
  });
  const [exclusaoResponder, setExclusaoResponder] =  useState<ExcluirPontos>()
  const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
  });
  const [ocupantes, setOcupantes] = useState<BasicResponseType[]>([]);
  const [open, setOpen] = useState<boolean>(false); 
  const [openModalHistoryRemovePoints, setOpenModalopenModalHistoryRemovePoints] =  useState<boolean>(false)
  const [openModalHistoric, setOpenModalopenModalHistoric] =  useState<boolean>(false) 
  const [historico, setHistorico] = useState(mokHistorico)
  
 
  // Funcoes
   const emptyFunction = () => {return null}
  
  // Descomentar caso volte a usar os municipios
  // const { loading: loadingCidades, call: pesquisarCidades } =
  //   useAsync(async () => {
  //     try {
  //       const response = await geralService.getCidades();
  //       setMunicipios(response);
  //     } catch (error) {
  //       toast({
  //         description: "Não foi possível carregar as Cidades",
  //         variant: "erro",
  //         position: "top"
  //       });
  //     }
  // }, []);

  const encodeFilters = useCallback(
    (filtros: Partial<ExcluirPontosFiltro>) => {
      return {
          ...filtros,
          dataInicio: filtros.dataSolicitacao ? formatDateApi(filtros.dataSolicitacao) : null   
        };
      },
      [filtros]
  );

    const { call: pesquisarFiltros } =
    useAsync(async () => {
      try {
        const encodedFilters = encodeFilters(filtros);
        setOcupantes(await concessionariaService.getOcupantes());
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os Filtros",
          variant: "erro",
          position: "top"
        });
      }
    }, []);

  useEffect(() => {
    pesquisarFiltros();
  }, []);
  
  const { call: listarPontosExclusao } = 
       useAsync(async (pagination: PaginationState, filtros:Partial<ExcluirPontosFiltro>) => {
         try {
           const encodedFilters = encodeFilters(filtros);
           const response = await ExcluirPontoService.getExcluirPonto({limit: pagination.pageSize, page: pagination.pageIndex}, encodedFilters)
           // Feita a ordenacao via Front End
           var excluirPontosAux = response
           // decrecente excluirPontosAux.data.sort((a, b) => b.id - a.id)
           // ascendente
           excluirPontosAux.data.sort((a, b) => a.id - b.id)
           setExcluirPontos(response.data)
           setCount(response.count)
         } catch (error) {
           toast({ 
            title: "Erro",
            description: "Não foi possível carregar os Pontos de Exclusao", 
            variant: "erro",
            position: "top"
          });
         }
  }, []);

  const handleVisualizar = (id : number) => {
    router.push(`/concessionaria/excluir-pontos/visualizar-exclusao/${id}`);
  }

  const handleAnalisar = async (excluirPonto: ExcluirPontos) => {
    if(!excluirPonto?.analistaConcessionaria){
      try {
      const response = await ExcluirPontoService.atualizarStatusExclusaoPontos(excluirPonto.id, {
        status: "EmAnalise",
        motivo: "",
      });
      router.push(`/concessionaria/excluir-pontos/analisar-exclusao/${excluirPonto.id}`);
      } catch (error) {
      }
    } else if (excluirPonto?.analistaConcessionaria && user?.id !== excluirPonto?.analistaConcessionaria.id) {
      toast({ 
        title: "Advertencia" ,
        description: `Esta solicitação já está sendo atendida pelo analista ${excluirPonto.analistaConcessionaria.name}`, 
        variant: "advertencia", 
        position: "top"
      });
      return null
    } else {
      router.push(`/concessionaria/excluir-pontos/analisar-exclusao/${excluirPonto.id}`);
    }

  }

  const handleExportarPontos = (id : number) => {
    window.open(
      `/api/backend?uri=concessionaria/exclusao-pontos/${id}/exportar-pontos`,
      "_blank"
    );
  }

  const verificarPossuiHistorico = () => {
    return false
  }

  const handleHistorico = (exclusao: ExcluirPontos) => {
    setExclusaoResponder(exclusao)
    setOpenModalopenModalHistoric(true)
  }

  const handleResponder = (exclusao: ExcluirPontos) => {
    setExclusaoResponder(exclusao)
    if(!(!verificarPossuiHistorico)){
      setOpenModalopenModalHistoryRemovePoints(true)
    } else {
      setOpen(true)
    }
  }

  const renderActions = (excluirPontos : ExcluirPontos) => {
    const actions: ActionBarItemType[] = [
      {
        icon: <IconGfonts id="download" />  ,
        title: "Exportar Pontos",
        onClick: () => handleExportarPontos(excluirPontos.id)
      },
      ...(excluirPontos.status === "Pausado"
                    ? [ {
                      icon: <IconGfonts id="chat" />, 
                      title: "Responder",
                      onClick: () => handleResponder(excluirPontos)
                    }]
                    : []),
      {
        icon: <IconGfonts id="history" />,
        title: "Histórico",
        onClick: () => handleHistorico(excluirPontos)
      },
      {
        icon: <Icons.eye />,
        title: "Visualizar",
        onClick: () => handleVisualizar(excluirPontos.id)
      },
      {
        icon: <IconGfonts id="touch_app" />, 
        title: "Analisar",
        onClick: () => handleAnalisar(excluirPontos),
        //disabled: excluirPontos.status === "Aprovado" || excluirPontos.status === "Reprovado"
      }
    ];
    return <ActionBar actions={actions} />
  };

  const { loading, call: listNotificacoes } = useAsync(async (pagination: PaginationState, filtros: FiltrosNotificacaoType) => {
    const page = {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    }

    // const encodedFilters = encodeFilters(filtros);
    // try {
    //   const response = await notificacaoService.getNotificacoes(page, encodedFilters);
    //   setNotificacoes(response);
    // } catch (error) {
    //   toast({ description: "Não foi possível carregar as notificações", variant: "erro" })
    // }
  }, []);

  function pesquisarExcluirPontos(pagination : any, filtros : any){
    return null
  }
  
  useEffect(() => {
    listarPontosExclusao(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize]);  
    
  // Descomentar caso volte a usar os municipios
  // useEffect(() => {
  //   pesquisarCidades();
  // }, []);

  // Renders
  const renderFiltroExcluirPontos = () => (
      <FiltrosExcluirPontos
        municipios={municipios}
        values={filtros}
        ocupantes={ocupantes}
        onPesquisar={() => listarPontosExclusao(pagination, filtros)}
        onChange={(filtros: ExcluirPontosFiltro) => {
          setFiltros(filtros);
        } }
        router={router} 
        onOpenModalNovaExclusao={() => {} }      
      />
  );

  const RenderModalHistoric = () => {
      return openModalHistoric && exclusaoResponder ? (
      <>
           <HistoryOrChatRemovePoints
            isOpen={openModalHistoric}
            onClose={() => setOpenModalopenModalHistoric(false) }
            // onSubmit={() => setOpenModalopenModalHistoryRemovePoints(false) }
            habilitaResponder={false}
            exclusaoRef={exclusaoResponder} 
            usuario={"concessionaria"}
          />
      </>
      ) : null
  }
  
  const RenderModalChat = () => {
      return openModalHistoryRemovePoints && exclusaoResponder ? (
      <>
           <HistoryOrChatRemovePoints
            isOpen={openModalHistoryRemovePoints}
            onClose={() => setOpenModalopenModalHistoryRemovePoints(false) }
            // onSubmit={() => setOpenModalopenModalHistoryRemovePoints(false) }
            habilitaResponder={true}
            exclusaoRef={exclusaoResponder} 
            usuario={"concessionaria"}
          />
      </>
      ) : null
  }   
    
  const RenderModalHistoryEmpty = () => {
      return open ? (
      <>
           <HistoryEmptyModal
            isOpen={open}
            onClose={() => setOpen(false)}
            loading={loading}
            description="Não Existe Histórico para essa exclusão!"
          />
      </>
      ) : null
  } 

  const RenderFilterAndTable = () => {
    return (
      <Pesquisa
        breadcrumbItems={breadcrumbItems}
        titulo="Exclusão Pontos"
        filtros={renderFiltroExcluirPontos()}
        grid={
                <Grid
                  colunas={colunas}
                  data={excluirPontos}
                  loading={loading}
                  page={pagination.pageIndex}
                  count={count}
                  limit={pagination.pageSize}
                  setPagination={setPagination}
                />
              }
        /> 
    )
  }     

  return (
    <ScrollArea className="h-full">
      {RenderModalHistoric()}
      {RenderModalChat()}
      {RenderModalHistoryEmpty()}   
      {RenderFilterAndTable()}    
    </ScrollArea>
  );
}

