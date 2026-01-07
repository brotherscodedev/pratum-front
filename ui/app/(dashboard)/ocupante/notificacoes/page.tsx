"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Pesquisa } from "@/components/crud/pesquisa";
import {
  Colunas,
  Notificacao,
} from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, formatDateApi } from "@/lib/utils";
import { Grid } from "@/components/crud/grid";
import { FiltrosNotificacao } from "./filtros";
import { addDays } from "date-fns";
import { PagedResponseType } from "@/services/http";
import notificacaoService, { NotificacaoResponseType } from "@/services/ocupante/notficacoes-service";
import useAsync from "@/hooks/useAsync";
import { PaginationState } from "@tanstack/react-table";
import { FiltrosNotificacaoType } from "./types";
import cidadeService, { CidadeBasicResponseType } from "@/services/cidade-service";
import ActionBar, { ActionBarItemType } from "@/components/action-bar";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import ResponderNotificacaoModal from "./responder/[id]/responder_notificacao";
import { MeuContexto } from "@/app/MeuContexto";



const NotificacoesPage = () => {

  // Variaveis e Constantes
  const MILISEGUNDO_DIAS = 86400000; // Contem a quantidade de milisegundo em 1 dia
  const PRAZO_DIAS_NOTIFICACAO_VENCER = 5
  const [notificacoesVencer, setNotificacoesVencer] = useState<boolean>(false);
  const contexto = useContext(MeuContexto) as any;
  const { bloqueioMenu, setBloqueioMenu } = contexto;

  const colunas: Colunas<Notificacao> = [
    {
      accessorKey: "id",
      header: "ID Notificação",
    }, 
      {
      accessorKey: "tipo.tipo",
      header: "Tipo da Notificação",
    },
    {
      accessorKey: "dataEnviada",
      header: "Data do envio",
      cell: ({ row }) => {
        const dataEnviada = new Date(row.original.dataEnviada);
        if (isNaN(dataEnviada.getTime())) {
          return '-';  
        }
        return dataEnviada.toLocaleDateString("pt-BR");
      },
    },
    {
      accessorKey: "prazo",
      header: "Prazo",
    },
    {
      accessorKey: "motivo",
      header: "Descrição",
    },
    {
      accessorKey: "cidade.nome",
      header: "Cidade",
    }, 
    {
      accessorKey: "solicitante.name",
      header: "Usuário",
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

  const renderActions = (notificacao: Notificacao) => {

    const actions: ActionBarItemType[] = [
      {
        icon: <Icons.history />,
        title: "Histórico de Interações",
        onClick: () => handleVisualizarHistorico(notificacao.id),
        disabled: notificacao.status !== 'Em defesa' && notificacao.status !== 'Concluida'
      },
      {
        icon: <Icons.eye />,
        title: "Visualizar",
        onClick: () => {
          if(notificacao.status === "Enviada"){
            marcarNotificacaoLida(notificacao.id);
          
            setTimeout(() => {
              listNotificacoes(pagination, filtros);
            }, 1000)

            setTimeout(() => {
              handleVizualizarNotificacao(notificacao.id)
            }, 2000)
          } else{
            handleVizualizarNotificacao(notificacao.id)
          }
          
        },
        //disabled: notificacao.status !== "Enviada"
        //onClick: () => handleEditarNotificacao(notificacao.id)
      },
      // {
      //   icon: <Icons.circleCheck />,
      //   title: 'Marcar como lido',
      //   onClick: () => {
      //     marcarNotificacaoLida(notificacao.id);
      //     listNotificacoes(pagination, filtros);
      //   }
      // },
      // ...(notificacao.tipo.permiteInteracao && notificacao.status === 'Enviada' || notificacao.status === 'Em defesa'
      //   ? [{
      //       icon: <Icons.filePenLine />,
      //       title: "Responder",
      //       onClick: () => handleInteragirNotificacao(notificacao)
      //     }]
      //   : [])
      {
        icon: <Icons.filePenLine />,
        title: "Responder",
        onClick: () => handleInteragirNotificacao(notificacao),
        //disabled: notificacao.tipo.permiteInteracao === false || (notificacao.status !== 'Enviada' && notificacao.status !== 'Em defesa')
        disabled: notificacao.tipo.permiteInteracao === false || notificacao.status == "Enviada" || notificacao.status == "Concluída" || notificacao.status == "Rascunho" || notificacao.status == "Inativa" || notificacao.status == "Rascunho" || notificacao.status == "Concluida"
      }
    ]

    return (
      <ActionBar actions={actions} />
    )
  }

  const breadcrumbItems = [
  { title: "Notificações", link: "/ocupante/notificacoes" },
  ];

  const { toast } = useToast();
  const router = useRouter();
  const [historico, setHistorico] = useState<any[]>([])
  const [isModalHistoricoOpen, setIsModalHistoricoOpen] = useState(false);

  const [filtros, setFiltros] = useState<FiltrosNotificacaoType>({
    cidadeId: "",
    motivo: "",
    id: '',
    tipo: '',
    status: '',
    prazoDe: null,//new Date()
    prazoAte: null ,//addDays(new Date(), 30)
  });

  const [notificacoes, setNotificacoes] = useState<PagedResponseType<NotificacaoResponseType> | []>([]);
  const [cidades, setCidades] = useState<CidadeBasicResponseType[]>();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Funcoes
  const encodeFilters = useCallback((filtros: FiltrosNotificacaoType) => {
    return {
      ...filtros,
      prazoDe: filtros.prazoDe ? formatDateApi(filtros.prazoDe) : null,
      prazoAte: filtros.prazoAte ? formatDateApi(filtros.prazoAte) : null
    }
  }, [filtros, formatDateApi]);

  const { loading, call: listNotificacoes } = useAsync(async (pagination: PaginationState, filtros: FiltrosNotificacaoType) => {
    const page = {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    }

    const encodedFilters = encodeFilters(filtros);
    try {
      const response = await notificacaoService.getNotificacoes(page, encodedFilters);
      if (Array.isArray(response)) {
        setBloqueioMenu(false)
        setNotificacoes([])
      } else {
        if(response.existeNaoLida){
          setBloqueioMenu(true)
        } else{
          setBloqueioMenu(false)
        }
        var notificacoesAux = response
        if(response.data === null){
          setNotificacoes([])
        } else{
          // Feita a ordenacao via Front End
          notificacoesAux.data.sort((a, b) => b.id - a.id)
          setNotificacoes(notificacoesAux as any);
          verificarTemNotificacoesVencer(notificacoesAux.data)
        }
      }
      
    } catch (error) {
      toast({ 
        description: "Não foi possível carregar as notificações", 
        variant: "erro", 
        position: "top"
      })
    }
  }, []);

  function verificarTemNotificacoesVencer(array : any){
    const dataAtual = new Date();
    for (let index = 0; index < array.length; index++) {
      let dataAux = new Date(array[index].dataPrazo);
      let res = (dataAux.getTime() - dataAtual.getTime() ) / MILISEGUNDO_DIAS
      if(res < PRAZO_DIAS_NOTIFICACAO_VENCER &&  0 < res){
        //toast({ description: "Possui notificacoes a vencer", variant: "sucesso" })
        setNotificacoesVencer(true)
        break
      }   
    }
  }

  const { call: listCidades } = useAsync(async () => {
    const response = await cidadeService.getCidadesBasicList();
    setCidades(response)
  }, []);

  useEffect(() => {
    listCidades();
  }, [listCidades]);

  
  useEffect(() => {
    listNotificacoes(pagination, filtros);
  }, [])

  useEffect(() => {
    listNotificacoes(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize, listNotificacoes])

  const marcarNotificacaoLida = useCallback(async (notificacaoId: number) => {
    notificacaoService.markRead(notificacaoId)
      .then(() => toast({
        title: "Sucesso",
        description: "Notificação lida.", 
        variant: "sucesso",
        position: "top" 
      }))
      .catch(() => toast({
        title: "Erro", 
        description: "Não foi possível marcar a notificação como lida.", 
        variant: "erro",
        position: "top" 
      }))
  }, [])

  const handleAtualizaResponsavelNotificacao = useCallback(async (notificacao: Notificacao) => {
    notificacaoService.markRead(notificacao.id)
      .then(() => {
        toast({ description: "Notificação lida.", variant: "sucesso" })} 

      )
      .catch(() => toast({ description: "Não foi possível marcar a notificação como lida.", variant: "erro", position: "top" }))
  }, [])

  const handleInteragirNotificacao = useCallback((notificao: Notificacao) => {
    if(!notificao.reponsavel){
      router.push(`/ocupante/notificacoes/responder/${notificao.id}`)
    }
  }, []);

  const handleEditarNotificacao = useCallback((idNotificacao: number) => {
    router.push(`/ocupante/notificacoes/${idNotificacao}`)
  }, []);

  const handleVizualizarNotificacao = useCallback((idNotificacao: number) => {
    router.push(`/ocupante/notificacoes/${idNotificacao}`)
  }, []);

  const handleVisualizarHistorico = useCallback(async (idNotificacao: number) => {
      const historicoResponse = await notificacaoService.getHistoricoInteracoes(idNotificacao)
          setHistorico(historicoResponse);
          if(historicoResponse && historicoResponse.length > 0) {
            setIsModalHistoricoOpen(true)
          } else {
            toast({
              description: "Não existe histórico de interações.",
              variant: "destructive",
              position: "top"
            });
          }
    }, []);

    const handleSubmitResposta = async (resposta: string): Promise<void> => {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    };
  

  // Renders
  const RenderTabelaFiltro = () => {
    return (
      <>
        <Pesquisa
          breadcrumbItems={breadcrumbItems}
          titulo="Notificações"
          botoes={[]}
          filtros={[
            <FiltrosNotificacao
              onPesquisar={() => listNotificacoes(pagination, filtros)}
              cidades={cidades}
              values={filtros}
              onChange={setFiltros}
            />
          ]}
          grid={
            <Grid
              colunas={colunas}
              data={Array.isArray(notificacoes) ? [] : notificacoes?.data}
              loading={loading}
              page={pagination.pageIndex}
              count={Array.isArray(notificacoes) ? 0 : notificacoes?.count || 0}
              limit={pagination.pageSize}
              setPagination={setPagination}
              projetos
            />
          }
        />
      </>
    )
  }

  const RenderModalResponderNotificacao = () => {
    return (
      <>
        <ResponderNotificacaoModal
          isOpen={isModalHistoricoOpen}
          notificacaoId={0}
          onClose={() => setIsModalHistoricoOpen(false)}
          onSubmit={handleSubmitResposta}
          historico={historico}
          habilitaResponder={false}
        />
      </>
    )
  }

  const RenderMensagemNotificacoesVencer = () => {
    return (
      <>
      { notificacoesVencer && <h2 className="absolute top-24 right-16 text-red-500 text-right font-bold" > *EXISTEM  NOTIFICAÇÕES A VENCER </h2> }
      </>   
    )
  }

  return (
    <>
      {RenderMensagemNotificacoesVencer()}
      {RenderTabelaFiltro()}
      {RenderModalResponderNotificacao()}
    </>
  );
};

export default NotificacoesPage;
