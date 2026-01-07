"use client"
import { Icons } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicResponseType, PagedResponseType } from "@/services/http";
import {
  Colunas,
  ExcluirPontos,
  ExcluirPontosFiltro,
} from "@/types";
import React, { useCallback, useEffect, useState } from "react";
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
import { formatDateApi, formatDateTwo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { HistoryEmptyModal } from "@/components/modal/history-empty-modal";
import { NewRemovePointModal } from "@/components/modal/new-remove-point-modal";
import HistoryOrChatRemovePoints from "@/components/modal/history-remove-point";
import { AtachFileNotificationModal } from "@/components/modal/atach-file-notification-modal";
import ModalExportPoints from "@/components/modal/export-points-ocupante";
import  {excluirPontosMock}   from "@/constants/data";
import  {mokHistorico}   from "@/constants/data";
import excluirPontoService , { ExcluirPontoServiceType } from "@/services/ocupante/excluir-ponto";
import { ExcluirPonto } from "@/services/ocupante/excluir-ponto/types";
import ExcluirPontoService from "@/services/ocupante/excluir-ponto";
import { SendSomeFilesModal } from "@/components/modal/send-some-files-modal";

const breadcrumbItems = [{ title: "Exclusão de Pontos", link: "/concessionaria/excluir-pontos" }];

export default function page() {

 const router = useRouter()

  const [excluirPontos, setExcluirPontos] = useState<ExcluirPonto[]>([]) // excluirPontosMock  <ExcluirPonto[] | null>
  const [count, setCount] = useState<number>(0) // excluirPontosMock
  // xcluirPontosMock
  const [municipios, setMunicipios] = useState<BasicResponseType[]>([]);
  const [filtros, setFiltros] = useState<Partial<ExcluirPontosFiltro>>({
    nomeProjeto : undefined,
    nomeCidade : "",
    exclusaoId: "",
    quantidadePontos : undefined,
    dataSolicitacao : undefined,
    status : undefined,
  });
   // Modais
   const [open, setOpen] = useState<boolean>(false); 
   const [openModalNovaExclusao, setOpenModalNovaExclusao] =  useState<boolean>(false)  
   const [openModalHistoryRemovePoints, setOpenModalopenModalHistoryRemovePoints] =  useState<boolean>(false) 
   const [openModalChatPauseRemovePoints, setOpenModalChatPauseRemovePoints] =  useState<boolean>(false)
   const [openModalExportarPontos, setOpenModalExportarPontos] =  useState<boolean>(false)
   const [openModalFileAttach, setOpenModalFileAttach] =  useState<boolean>(false) 
   const [exclusaoResponder, setExclusaoResponder] =  useState<ExcluirPonto>()
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
  });
  const [historico, setHistorico] = useState(mokHistorico)
  
  const emptyFunction = () => {return null}

   const openModalFileAttachCloseModalNovaExclusao = () =>  {
     setOpenModalNovaExclusao(false)
     setOpenModalFileAttach(true)
   }

   const formatDateToBR = (iso: string) => {
    if (!iso) return "";
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
  };
  
  // Funcoes
  useEffect(() => {
    listarPontosExclusao(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize]);  
  
  //Descomentar caso va utilizar o filtro de municipios no mapa
  // useEffect(() => {
  //   pesquisarCidades();
  // }, []);
  
  const { loading,  call: listarPontosExclusao } = 
    useAsync(async (pagination: PaginationState, filtros:Partial<ExcluirPontosFiltro>) => {
      try {
        const encodedFilters = encodeFilters(filtros);
        const response = await excluirPontoService.getExcluirPonto({limit: pagination.pageSize, page: pagination.pageIndex}, encodedFilters)
        // Feita a ordenacao via Front End
        if (Array.isArray(response)) {
          setExcluirPontos([])
          setCount(0)
        } else {
          var excluirPontosAux = response
          // decrecente excluirPontosAux.data.sort((a, b) => b.id - a.id)
          // ascendente
          excluirPontosAux.data.sort((a, b) => a.id - b.id)
          setExcluirPontos(response.data)
          setCount(response.count)
        }
        
      } catch (error) {
        toast({ description: "Não foi possível carregar os Pontos de Exclusao", variant: "erro"});
      }
  }, []);

  // Descomentar caso usar o filtro de municipios no mapa
  // const { call: pesquisarCidades } =
  //   useAsync(async () => {
  //     try {
  //       const response = await geralService.getCidades();
  //       setMunicipios(response);
  //     } catch (error) {
  //       toast({
  //         description: "Não foi possível carregar as Cidades",
  //         variant: "erro",
  //       });
  //     }
  //   }, []);

  const encodeFilters = useCallback(
         (filtros: Partial<ExcluirPontosFiltro>) => {
           return {
             ...filtros,
             dataInicio: filtros.dataSolicitacao ? formatDateApi(filtros.dataSolicitacao) : null
           };
         },
         [filtros]
  );

  const handleVisualizar = (id : number) => {
    router.push(`/ocupante/excluir-pontos/visualizar-exclusao/${id}`);
  }

  const handleNavegarSelecionarPostes = useCallback(() => {
    router.push("/ocupante/excluir-pontos/selecionar-postes/1");
}, []);

  const handleExportarPontos = (id : number) => {
    window.open(
      `/api/backend?uri=ocupante/exclusao-pontos/${id}/exportar-pontos`,
      "_blank"
    );
    // setOpenModalExportarPontos(true)
  }

  const verificarPossuiHistorico = () => {
    return false
  }

  const handleHistorico = (exclusao: ExcluirPonto) => {
    setExclusaoResponder(exclusao)
    setOpenModalopenModalHistoryRemovePoints(true)
    // if(!verificarPossuiHistorico){
    //   //setOpenModalopenModalHistoryRemovePoints(true)
    //   setOpenModalChatPauseRemovePoints(true)
    // } else {
    //   //setOpen(true)
    //   setOpenModalChatPauseRemovePoints(true)
    // }
  }

  const handleResponder = (exclusao: ExcluirPonto) => {
    setExclusaoResponder(exclusao)
    setOpenModalChatPauseRemovePoints(true)
  }

  const colunas: Colunas<ExcluirPonto> = [
    {
      accessorKey: "id",
      header: "ID Exclusão",
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
      accessorKey: "postes", //quantidadeDePontos
      header: "Quant. de Pontos",
      cell: ({ row }) => {
        return row.original.quantidadeDePontos || row.original.postes?.length || 0
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
    // {
    //   accessorKey: "dataParecer",
    //   header: "Data Parecer",
    //   cell: ({ row }) => formatDateTwo(String(row.original.dataParecer), "short_date"),
    // },
    {
      accessorKey: "status",
      header: "Situação",
    },
    {
      id: "actions",
      cell: ({ row }) => renderActions(row.original),
    },
  ];

  // Renders
  const renderActions = (excluirPontos : ExcluirPonto) => {
    const actions: ActionBarItemType[] = [
      {
        icon: <IconGfonts id="download" />  ,
        title: "Exportar Pontos",
        onClick: () => handleExportarPontos(excluirPontos.id)
      },
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
      ...(excluirPontos.status === "Pausado"
              ? [ {
                icon: <IconGfonts id="touch_app" />, 
                title: "Responder",
                onClick: () => handleResponder(excluirPontos)
              }]
              : []),
     
    ];
    return <ActionBar actions={actions} />
  };

  const renderFiltroExcluirPontos = () => (
      <FiltrosExcluirPontos
        municipios={municipios}
        values={filtros}
        onPesquisar={() => listarPontosExclusao(pagination, filtros)}
        onChange={(filtros: Partial<ExcluirPontosFiltro>) => {
          setFiltros(filtros);
        }}
        onOpenModalNovaExclusao={() => setOpenModalNovaExclusao(true)}
        router={router}
      />
  );

  // Modais
  const RenderModalExportarPontos = () => {
      return openModalExportarPontos && (
      <>
          <ModalExportPoints
            isOpen={openModalExportarPontos}
            onClose={() => setOpenModalExportarPontos(false)}
          />
      </>
      ) 
  }

  const RenderModalAnexarArquivo = () => {
      return openModalFileAttach && (
      <>
        <SendSomeFilesModal
                open={openModalFileAttach}
                onOpenChange={() => {
                    setOpenModalFileAttach(false)
                }}
                actionSuccess={(file) => handleExclusaoByFile(file)}
                doUpload={false}
            />
      </>
      ) 
  }

  const handleExclusaoByFile = async (file: any) => {
  
    try {
          const formData = new FormData()
          formData.append('file', file)
                  const response = await ExcluirPontoService.saveRemovePointsByFile(formData)
                  listarPontosExclusao(pagination, filtros);
                                      setOpenModalFileAttach(false)

                } catch (error: any) {
                    toast({
                        title: "Erro ao gravar dados",
                        description: error?.response.data.error,
                        color: "error",
                        position: "top"
                      });

                                          setOpenModalFileAttach(false)

                }
  }

  const RenderModalReponderPausada = () => {
      return openModalChatPauseRemovePoints && exclusaoResponder ? (
      <>
           <HistoryOrChatRemovePoints
            isOpen={openModalChatPauseRemovePoints}
            onClose={() => setOpenModalChatPauseRemovePoints(false) }
            // onSubmit={() => setOpenModalChatPauseRemovePoints(false) }
            habilitaResponder={true}
            exclusaoRef={exclusaoResponder as any}
          />
      </>
    ) : null
  }
  
  const RenderModalHistoric = () => {
      return openModalHistoryRemovePoints && exclusaoResponder ? (
      <>
           <HistoryOrChatRemovePoints
            isOpen={openModalHistoryRemovePoints}
            onClose={() => setOpenModalopenModalHistoryRemovePoints(false) }
            habilitaResponder={false}
            exclusaoRef={exclusaoResponder as any} 
            usuario={"ocupante"}
          />
      </>
      ) : null
  } 

  const RenderModalSelectOption = () => {
      return openModalNovaExclusao && (
      <>
        <NewRemovePointModal
          isOpen={openModalNovaExclusao}
          onClose={() => setOpenModalNovaExclusao(false)}
          loading={loading}
          description="Selecione a opção desejada."
          openModalSubmitFile={openModalFileAttachCloseModalNovaExclusao }  
          navigateByMap={handleNavegarSelecionarPostes} 
        />
      </>
      ) 
  }   
    
  const RenderModalHistoryEmpty = () => {
      return open && (
      <>
        <HistoryEmptyModal
          isOpen={open}
          onClose={() => setOpen(false)}
          loading={loading}
          description="Não Existe Histórico para essa exclusão!"
        />
      </>
      ) 
  } 

  const RenderFilters = () => {
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
              count={count || 0}
              limit={pagination.pageSize}
              setPagination={setPagination}
            />
          }
        /> 
    )
  }

  return (
    <ScrollArea className="h-full">
      {RenderModalAnexarArquivo()}
      {RenderModalExportarPontos()}
      {RenderModalReponderPausada()}
      {RenderModalHistoric()}
      {RenderModalSelectOption()}
      {RenderModalHistoryEmpty()}
      {RenderFilters()}   
    </ScrollArea>
  );
}

