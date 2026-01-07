"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { Colunas } from "@/types";
import { formatDate, formatDateApi, formatDateTime, formatDateTwo, statusProjetoMap } from "@/lib/utils";
import { Grid } from "@/components/crud/grid";
import { Pesquisa } from "@/components/crud/pesquisa";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import ActionBar, { ActionBarItemType } from "@/components/action-bar";

import useAsync from "@/hooks/useAsync";
import { BasicResponseType, PagedResponseType } from "@/services/http/types";
import { PaginationState } from "@tanstack/react-table";

import { FiltrosProjetoType } from "./types";
import projetoService from "@/services/projeto-service";
import { useRouter } from "next/navigation";
import geralService from "@/services/geral";
import { ProjetoStatusAnalise, ProjetoStatusAprovado, ProjetoStatusCancelado, ProjetoStatusEmFila, ProjetoStatusPausado, ProjetoStatusRascunho, ProjetoStatusReprovado, ProjetoType } from "@/services/projeto-service/types";
import concessionariaService from "@/services/concessionaria/concessionaria-service";
import FiltrosProjeto from "./filtros";
import { UsuarioContext } from "@/app/context";
import IconGfonts from "@/components/icon-gfonts/icon";
import ModalSalvar from "./modal";
import HistoricoProjetosModal from "../../ocupante/projetos/modal-historico-projetos";

const breadcrumbItems = [{ title: "Projetos", link: "/ocupante/projetos" }];

function ProjetoPage() {

  // Variaveis e Constantes
  const router = useRouter();
  const user = useContext(UsuarioContext);

  const { toast } = useToast();
  const [projetos, setProjetos] = useState<PagedResponseType<ProjetoType>>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [cidades, setCidades] = useState<BasicResponseType[]>([]);
  const [analistas, setAnalistas] = useState<BasicResponseType[]>([]);
  const [ocupantes, setOcupantes] = useState<BasicResponseType[]>([]);
  const [historico, setHistorico] = useState<any>([])
  const [isModalProjetosHistoricoOpen, setisModalProjetosHistoricoOpen] = useState<boolean>(false)
  const [projetoAnalisado, setProjetoAnalisado] = useState<null | ProjetoType>(null)
  const [dataSubmissao, setDataSubmissao] = useState<any>(undefined)

  const formEmpty = {
    submissaoDe: undefined,
    submissaoAte: undefined,
    parecerDe: undefined,
    parecerAte: undefined,
    cidadeId: undefined,
    status: undefined,
    analistaId: undefined,
    ocupanteId: undefined,
  }

  const [filtros, setFiltros] = useState<FiltrosProjetoType>(formEmpty);

  // Funcoes
  const clearFiltros = () => {
    setDataSubmissao(undefined)
    setFiltros(formEmpty)
    console.log(filtros)
  }

  const {  call: pesquisarHistorico } = useAsync(async (id: number) => {
    try {
      
      const historicoResponse = await projetoService.getProjetoInterracao(id);
      console.log(historicoResponse)
      setHistorico(historicoResponse as any)
      
    } catch (error) {
      toast({
        description: "Não foi possível carregar o historico do Usuario",
        variant: "erro",
      });
    }
  }, []);

  const encodeFilters = useCallback(
    (filtros: FiltrosProjetoType) => {
      return {
        ...filtros,
        submissaoDe: filtros.submissaoDe ? formatDateApi(filtros.submissaoDe) : null,
        submissaoAte: filtros.submissaoAte ? formatDateApi(filtros.submissaoAte) : null,
        parecerDe: filtros.parecerDe ? formatDateApi(filtros.parecerDe) : null,
        parecerAte: filtros.parecerAte ? formatDateApi(filtros.parecerAte) : null
      };
    },
    [filtros]
  );

  const { loading: loadingProjetos, call: pesquisarProjetos } = useAsync(
    async (pagination: PaginationState, filtros: FiltrosProjetoType) => {
      try {
        const encodedFilters = encodeFilters(filtros);
        const response = await projetoService.getProjetosConcessionaria(
          { limit: pagination.pageSize, page: pagination.pageIndex },
          encodedFilters
        );
        setProjetos(response);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as Projetos",
          variant: "erro",
          position: "top"
        });
      }
    },
    []
  );

  const { loading: loadingCidades, call: pesquisarFiltros } =
    useAsync(async () => {
      try {
        const encodedFilters = encodeFilters(filtros);
        setCidades(await geralService.getCidades());
        setAnalistas(await concessionariaService.getAnalistas());
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

  useEffect(() => {
    pesquisarProjetos(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize, pesquisarProjetos]);

  const onSalvarStatusAnalisar = async (id: number) => {
      
      try {
        const response = await projetoService.postSalvarStatus(
         id,
         ProjetoStatusAnalise,
         "Início de análise do projeto"
        );
        //console.log(response)
        toast({
          title: "Sucesso",
          description: "Projeto em Analise!",
          variant: "sucesso",
          position: "top"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível salvar o projeto",
          variant: "erro",
          position: "top"
        });
      }
  };

  const analisarProjeto = async (projeto: ProjetoType) => {
    try {
      const projetoAnalise = await projetoService.analisarProjeto(projeto.id);

      toast({
          title: "Sucesso",
          description: "Status do projeto alterado para Em Analise",
          variant: "sucesso",
          position: "top"
        });

      if (!projetoAnalise || projetoAnalise.id !== projeto.id) {
        toast({
          title: "Alerta",
          description: "Análise não permitida para esse projeto",
          variant: "advertencia",
          position: "top"
        });
        return
      }

      // await projetoService.analisarProjeto(projeto.id);
      // toast({
      //   title: "Alerta",
      //   description: "Foi habilitada a análise do Projeto",
      //   variant: "sucesso",
      //   position: "top"
      // });
      // pesquisarProjetos(pagination, filtros);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o projeto para análise",
        variant: "erro",
        position: "top"
      });
    }
  }

  const alteratStatusProjetoEmFila = async (projeto: ProjetoType) => {
    try {
      const projetoAnalise = await projetoService.postSalvarStatus(
         projeto.id,
         ProjetoStatusEmFila,
         "Desistiu de analisar o Projeto"
        );

      toast({
        title: "Sucesso",
        description: "Status foi atualizado com sucesso",
        variant: "sucesso",
        position: "top"
      });

      pesquisarProjetos(pagination, filtros)

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o projeto para análise",
        variant: "erro",
        position: "top"
      });
    }
  }

  const visualizarProjeto = async (projeto: ProjetoType) => {
      // if (projeto.analista?.id !== user?.id) {
      //   toast({
      //     description: "Visualização não permitida para esse projeto",
      //     variant: "advertencia",
      //   });
      //   return
      // }

      router.push(`/concessionaria/projetos/visualizar/${projeto.id}`);

  }

  const navegarAnalisarProjeto = async (projeto: ProjetoType) => { 

    router.push(`/concessionaria/projetos/analisar/${projeto.id}`);
  }

  const renderActions = (projeto: ProjetoType, meuId : number) => {
    const actions: ActionBarItemType[] = [
      {
        // icon:<Icons.search/>,
        // title: "Analisar",
        icon: <IconGfonts id="touch_app" />, 
        title: "Analisar",
        // onClick: () => {
        //   analisarProjeto(projeto)
        // },
         onClick: () => {
          //onSalvarStatusAnalisar(projeto.id)
          if(projeto.status === ProjetoStatusEmFila) {
            analisarProjeto(projeto)
            setTimeout(() => {
              navegarAnalisarProjeto(projeto);
            }, 1000)
          } else { // Caso o projeto possua o status de Em Analise ele navega para a tela de Analisar Projeto
            setTimeout(() => {
              navegarAnalisarProjeto(projeto);
            }, 1000)
          }
          
        },
        disabled: !projeto.habilitadoParaAnalise
      },
      // Funcionalidade de Desistir da Analise
      // {
      //   icon: <IconGfonts id="reply" />, 
      //   title: "Desistir da Analise",
      //    onClick: () => {
      //     alteratStatusProjetoEmFila(projeto)
      //   },
      //   disabled: projeto.status !== ProjetoStatusAnalise 
      // },
      {
        icon:<Icons.eye/>,
        title: "Visualizar",
        onClick: () => {
          visualizarProjeto(projeto);
        },
        //disabled: projeto.analista?.id !== meuId,
      },
      {
        icon: <Icons.history />,
        title: "Historico",
        onClick: () => {
          pesquisarHistorico(projeto.id)
          setisModalProjetosHistoricoOpen(true)
        }
      },

    ];

    return <ActionBar actions={actions} />;
  };

  const colunas: Colunas<ProjetoType> = [
    {
      accessorKey: "id",
      header: "ID PROJETO",
    },
    {
      accessorKey: "empresaOcupante.nomeFantasia",
      header: "OCUPANTE",
    },
    {
      accessorKey: "descricao",
      header: "DESCRICAO",
    },
    // {
    //   accessorKey: "empresaOcupante.nomeFantasia",
    //   header: "NOME DO OCUPANTE",
    // },
    {
      accessorKey: "cidade.nome",
      header: "CIDADE",
    },
    {
      accessorKey: "dataSubmissao",
      header: "DATA DA SUBMISSÃO",
      cell: ({ row }) =>   formatDateTwo(row.original.dataSubmissao, "short_date"),
    },
    // {
    //   accessorKey: "quantidadeDePontos",
    //   header: "PONTOS",
    // },
    // {
    //   accessorKey: "analista.name",
    //   header: "ANALISADO POR",
    // },
    {
      accessorKey: "dataParecer",
      header: "DATA PARECER",
      cell: ({ row }) => 
      //   {
      //   if(row.original.dataParecer === undefined){
      //     return "Pendente"
      //   } else{
      //     //const dataEnviada = new Date(row.original.dataParecer);
      //     formatDateTwo(row.original.dataParecer, "short_date")
      //   }
      // },
        
      formatDateTwo(row.original.dataParecer, "short_date"),
    },
    {
      accessorKey: "status",
      header: "SITUAÇÃO",
      cell: ({ row }) => statusProjetoMap[row.original.status],
    },
    {
      id: "actions",
      cell: ({ row }) => renderActions(row.original , user?.id || 0),
    },
  ];


  const renderFiltroProjetos = () => (
    <FiltrosProjeto
      cidades={cidades}
      analistas={analistas}
      ocupantes={ocupantes}
      values={filtros}
      onPesquisar={() => pesquisarProjetos(pagination, filtros)}
      onChange={(filtros: FiltrosProjetoType) => {
        setFiltros(filtros);
      }}
    />
  );

  const RenderModalHistoricoProjeto = () => {
    return (
      <>
        <HistoricoProjetosModal
          isOpen={isModalProjetosHistoricoOpen}
          onClose={() => setisModalProjetosHistoricoOpen(false)}
          historico={historico as any}
        />
      </>
    )
  }

  return (
    <>
    {RenderModalHistoricoProjeto()}
      <Pesquisa
        breadcrumbItems={breadcrumbItems}
        titulo="Projetos"
        botoes={null}
        filtros={renderFiltroProjetos()}
        //filtros={null}
        grid={
          <Grid
            colunas={colunas}
            data={projetos?.data}
            loading={loadingProjetos}
            page={pagination.pageIndex}
            count={projetos?.count || 0}
            limit={pagination.pageSize}
            setPagination={setPagination}
          />
        }
      />
    </>
  );
}

export default ProjetoPage;