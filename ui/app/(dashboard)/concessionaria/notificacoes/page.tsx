"use client";

import ActionBar, { ActionBarItemType } from "@/components/action-bar";
import { Grid } from "@/components/crud/grid";
import { Pesquisa } from "@/components/crud/pesquisa";
import { Icons } from "@/components/icons";
import { SimpleModal } from "@/components/modal/simple-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import useAsync from "@/hooks/useAsync";
import { formatDateApi, formatDateTwo } from "@/lib/utils";
import cidadeService, { CidadeBasicResponseType } from "@/services/cidade-service";
import notificacaoService, { NotificacaoResponseType } from "@/services/concessionaria/notificacao-service";
import { PagedResponseType, PageRequestType } from "@/services/http";
import {
  Colunas,
  Notificacao,
} from "@/types";
import { PaginationState } from "@tanstack/react-table";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiltrosNotificacao } from "./filtros";
import { FiltrosNotificacaoType } from "./types";
import ResponderNotificacaoModal from "./responder/[id]/responder_notificacao";



const NotificacoesPage = ({ params }: { params: { idNotificacao: PageRequestType } }) => {

  // Variaveis e Constantes
  const MILISEGUNDO_DIAS = 86400000; // Contem a quantidade de milisegundo em 1 dia
  const PRAZO_DIAS_NOTIFICACAO_VENCER = 5
  const [notificacoesVencer, setNotificacoesVencer] = useState<boolean>(false);
  
  const breadcrumbItems = [
  { title: "Notificações teste", link: "/concessionaria/notificacoes" },
  ];

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
        accessorKey: "empresa.nomeFantasia",
        header: "Empresa ocupante",
      },
      {
        accessorKey: "cidade.nome",
        header: "Município",
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
        accessorKey: "dataPrazo",
        header: "Data de resposta",
        cell: ({ row }) => formatDateTwo(row.original.dataPrazo  , "short_date"), // trocar para dataPrazo caso queira disponibilizar data prazo
          // const dataEnviada = new Date(row.original.dataPrazo);
          // if (isNaN(dataEnviada.getTime())) {
          //   return 'Pendente';  
          // }
          // return dataEnviada.toLocaleDateString("pt-BR");
        // },
      },
      // {
      //   accessorKey: "maximoInteracoes",
      //   header: "Interações",
      // },
      {
        accessorKey: "status",
        header: "Situação",
      },
      {
        accessorKey: "solicitante.name",
        header: "Usuário",
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
        disabled: notificacao.tipo.permiteInteracao === false
      },
      {
        icon: <Icons.eye />,
        title: "Visualizar",
        onClick: () => handleEditarNotificacao(notificacao.id)
      },
      {
        icon: <Icons.close />,
        title: "Concluir ou Inativar",
        onClick: () => handleDetalhesNotificacao(notificacao.id)
      },
      // ...(notificacao.tipo.permiteInteracao && notificacao.status === 'Enviada' || notificacao.status === 'Em defesa'
      //   ? [{
      //       icon: <Icons.filePenLine />,
      //       title: "Responder",
      //       onClick: () => handleResponderNotificacao(notificacao.id)
      //     }]
      //   : [])
      {
        icon: <Icons.filePenLine />,
        title: "Responder",
        onClick: () => handleResponderNotificacao(notificacao.id),
        //disabled: notificacao.tipo.permiteInteracao === false
        disabled: notificacao.tipo.permiteInteracao === false || notificacao.status == "Enviada" || notificacao.status == "Concluída" || notificacao.status == "Rascunho" || notificacao.status == "Inativa" || notificacao.status == "Rascunho" || notificacao.status == "Concluida"  
      }
    ];
    return <ActionBar actions={actions} />
  };

  const { idNotificacao } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [motivo, setMotivo] = useState<string>("");
  const [selectedNotificacaoId, setSelectedNotificacaoId] = useState<number | null>(null);
  const [historico, setHistorico] = useState<any[]>([])
  const [isModalHistoricoOpen, setIsModalHistoricoOpen] = useState(false);

  const [filtros, setFiltros] = useState<FiltrosNotificacaoType>({
    cidadeId: "",
    tipo: "",
    prazoDe: null,//new Date()
    prazoAte: null ,//addDays(new Date(), 30)
  });

  const [notificacoes, setNotificacoes] = useState<PagedResponseType<NotificacaoResponseType> | undefined>();
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
      const response = await notificacaoService.getNotificacoes(page, encodedFilters);//  caso queira usar os filtros
      console.log(response)
      // Feita a ordenacao via Front End
      if(Array.isArray(response)){
        setNotificacoes(undefined)
      } else {
        var notificacoesAux = response
        if(response.data === null){
          setNotificacoes(undefined)
        } else {
          notificacoesAux.data.sort((a, b) => b.id - a.id)
          setNotificacoes(notificacoesAux);
          verificarTemNotificacoesVencer(notificacoesAux.data)
        }
      }
      
    } catch (error) {
      toast({ 
        title: "Erro",
        description: "Não foi possível carregar as notificações", 
        variant: "erro",
        position: "top"
      })
    }
  }, []);

  const { call: listCidades } = useAsync(async () => {
    const response = await cidadeService.getCidadesBasicList();
    setCidades(response)
  }, []);

  useEffect(() => {
    listCidades();
  }, [listCidades]);

  useEffect(() => {
    listNotificacoes(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize, listNotificacoes]);

  const handleVisualizarHistorico = useCallback(async (idNotificacao: number) => {
    const historicoResponse = await notificacaoService.getHistoricoInteracoes(idNotificacao)
        setHistorico(historicoResponse);
        if(historicoResponse && historicoResponse.length > 0) {
          setIsModalHistoricoOpen(true)
        } else {
          toast({
            title: "Alerta",
            description: "Não existe histórico de interações.",
            variant: "advertencia",
            position: "top"
          });
        }
  }, []);

  const handleResponderNotificacao = useCallback((idNotificacao: number) => {
    router.push(`/concessionaria/notificacoes/responder/${idNotificacao}`)
  }, []);
  const handleEditarNotificacao = useCallback((idNotificacao: number) => {
    router.push(`/concessionaria/notificacoes/${idNotificacao}`)
  }, []);

  const handleDetalhesNotificacao = useCallback((idNotificacao: number) => {
    setSelectedNotificacaoId(idNotificacao);
    setIsModalOpen(true);
  }, []);

  const handleSubmitResposta = async (resposta: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleSave = async () => {
    const confirmation = window.confirm("A notificação será inativada, confirma?");
    if (!confirmation) {
      return;
    }
    if (!selectedAction) {
      console.error("Selecione uma ação para continuar.");
      toast({
        title: "Erro",
        description: "Por favor, selecione uma ação.",
        variant: "destructive",
        position: "top"
      });
      return;
    }

    if (selectedAction === "Inativar" && !motivo) {
      console.error("Para inativar, é obrigatório fornecer um motivo.");
      toast({
        title: "Erro",
        description: "É obrigatório fornecer um motivo para inativar.",
        variant: "destructive",
        position: "top"
      });
      return;
    }

    try {
      const data: Partial<NotificacaoResponseType> = {
        status: selectedAction === "Concluir" ? "Concluida" : "Inativa",
        ...(selectedAction === "Inativar" && { motivo: motivo }),
      };

      const response = await notificacaoService.putConcluiInativaNotificacao(selectedNotificacaoId, data);

      toast({
        title: "Alerta",
        description: `Notificação ${selectedAction.toLowerCase()} com sucesso!`,
        variant: "sucesso",
        position: "top"
      });

      setIsModalOpen(false);
      setSelectedAction("");
      setMotivo("")
    } catch (error: any) {
      console.error("Erro ao realizar a ação:", error);

      if (error.response?.data?.code === "API002") {
        toast({
          title: "Erro",
          description: error.response.data.message || "Erro na ação solicitada.",
          variant: "destructive",
          position: "top"
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro inesperado ao tentar realizar a ação.",
          variant: "destructive",
          position: "top"
        });
      }
    }
  };

  function verificarTemNotificacoesVencer(array : any){
    const dataAtual = new Date();
    //console.log(dataAtual.getTime());
    console.log(array)
    for (let index = 0; index < array.length; index++) {
      let dataAux = new Date(array[index].dataPrazo);
      console.log(dataAux)
      let res = (dataAux.getTime() - dataAtual.getTime() ) / MILISEGUNDO_DIAS
      console.log(res)
      if(res < PRAZO_DIAS_NOTIFICACAO_VENCER &&  0 < res){
        //toast({ description: "Possui notificacoes a vencer", variant: "sucesso" })
        setNotificacoesVencer(true)
        break
      }   
    }
  }

  //Renders
  const RenderTabelaFiltro = () => {
    return (
      <>
        <Pesquisa
          breadcrumbItems={breadcrumbItems}
          titulo="Notificações"
          filtros={[
            <FiltrosNotificacao
              onPesquisar={() => listNotificacoes(pagination, filtros)}
              cidades={cidades}
              values={filtros}
              onChange={setFiltros}
              router={router}
            />,
          ]}
          grid={
            <Grid
              colunas={colunas}
              data={notificacoes?.data}
              loading={loading}
              page={pagination.pageIndex}
              count={notificacoes?.count || 0}
              limit={pagination.pageSize}
              setPagination={setPagination}
            />
          }
        />
      </>
    )
  }

  const RenderResponderNotificacaoModal = () => {
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
  
  const RenderModalConcluirInativarNotificacao = () => {
    return (
      <>
        <SimpleModal
        open={isModalOpen}
        titulo="Concluir/Inativar notificação"
        descricao="Selecione a ação e descreva o motivo:"
        onOpenChange={(open) => setIsModalOpen(open)}
      >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ação</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inativar">Inativar</SelectItem>
                  <SelectItem value="Concluir">Concluir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Motivo</label>
              <Input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Digite o motivo"
              />
            </div>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </SimpleModal>
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
      {RenderModalConcluirInativarNotificacao()}
      {RenderResponderNotificacaoModal()}
    </>
  );
};

export default NotificacoesPage;