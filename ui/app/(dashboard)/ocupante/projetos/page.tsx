"use client";

import React, { useCallback, useEffect, useState } from "react";
import { addDays, set } from "date-fns";
import { formatDate, formatDateTwo, statusProjetoMap } from "@/lib/utils";
import { Colunas } from "@/types";
import { formatCurrency, formatDateApi } from "@/lib/utils";
import FiltrosProjeto from "@/app/(dashboard)/ocupante/projetos/filtros";
import { Grid } from "@/components/crud/grid";
import { Pesquisa } from "@/components/crud/pesquisa";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import ActionBar, { ActionBarItemType } from "@/components/action-bar";

import useAsync from "@/hooks/useAsync";
import { BasicResponseType, PagedResponseType } from "@/services/http/types";
import { PaginationState } from "@tanstack/react-table";

import { FiltrosProjetoType } from "./types";
import projetoService, {
  ProjetoResponseType,
} from "@/services/projeto-service";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import geralService from "@/services/geral";
import {
  ProjetoStatusAnalise,
  ProjetoStatusPausado,
  ProjetoStatusRascunho,
  ProjetoType,
} from "@/services/projeto-service/types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { SimpleModal } from "@/components/modal/simple-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HistoricoUsuarioModal from "./modal-historico-projetos";
import HistoricoProjetosModal from "./modal-historico-projetos";

const breadcrumbItems = [{ title: "Projetos", link: "/ocupante/projetos" }];

function ProjetoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projetos, setProjetos] = useState<PagedResponseType<ProjetoType>>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [historico, setHistorico] = useState<any>([])
  const [cidades, setCidades] = useState<BasicResponseType[]>([]);
  const [projetoCancelar, setProjetoCancelar] = useState<
    ProjetoType | undefined
  >(undefined);

  const [isModalProjetosHistoricoOpen, setisModalProjetosHistoricoOpen] = useState<boolean>(false)

  const [filtros, setFiltros] = useState<FiltrosProjetoType>({
    criacaoDe: undefined,
    criacaoAte: undefined,
    cidadeId: undefined,
    status: undefined,
    descricao: undefined,
  });

  const encodeFilters = useCallback(
    (filtros: FiltrosProjetoType) => {
      return {
        ...filtros,
        criacaoDe: filtros.criacaoDe ? formatDateApi(filtros.criacaoDe) : null,
        criacaoAte: filtros.criacaoAte
          ? formatDateApi(filtros.criacaoAte)
          : null,
      };
    },
    [filtros]
  );

  const { loading: loadingProjetos, call: pesquisarProjetos } = useAsync(
    async (pagination: PaginationState, filtros: FiltrosProjetoType) => {
      try {
        const encodedFilters = encodeFilters(filtros);
        const response = await projetoService.getProjetos(
          { limit: pagination.pageSize, page: pagination.pageIndex },
          encodedFilters
        );
        setProjetos(response);
      } catch (error) {
        toast({
          description: "Não foi possível carregar as Projetos",
          variant: "erro",
          position: "top"
        });
      }
    },
    []
  );

  const { loading: loadingCidades, call: pesquisarCidades } =
    useAsync(async () => {
      try {
        const encodedFilters = encodeFilters(filtros);
        const response = await geralService.getCidades();
        setCidades(response);
      } catch (error) {
        toast({
          description: "Não foi possível carregar as Cidades",
          variant: "erro",
          position: "top"
        });
      }
    }, []);

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

  useEffect(() => {
    pesquisarCidades();
  }, []);

  useEffect(() => {
    pesquisarProjetos(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize, pesquisarProjetos]);

  const editarProjeto = (projeto: ProjetoType) => {
    router.push("/ocupante/projetos/" + projeto.id);
  };

  const detalhesProjeto = (projeto: ProjetoType) => {
    router.push("/ocupante/projetos/detalhes/" + projeto.id);
  };

  const visualizarProjeto = (projeto: ProjetoType) => {
    router.push("/ocupante/projetos/visualizar/" + projeto.id);
  };

  const cancelarProjeto = async () => {
    try {
      await projetoService.cancelarProjeto(projetoCancelar?.id);
      setProjetoCancelar(undefined);
      pesquisarProjetos(pagination, filtros);
      toast({
        description: "Projeto cancelado com sucesso",
        variant: "sucesso",
        position: "top"
      });
    } catch (error) {
      console.log(error);
      toast({
        description: "Não foi possível cancelar o projeto",
        variant: "erro",
        position: "top"
      });
    }
  };

  const exportarPontos = async (projeto: ProjetoType) => {
    try {
      window.open(
        `/api/backend?uri=ocupante/projeto/${projeto.id}/exportar-pontos`,
        "_blank"
      );
    } catch (error) {
      console.log(error);
      toast({
        description: "Não foi possível exportar os pontos",
        variant: "erro",
        position: "top"
      });
    }
  };

  const renderActions = (projeto: ProjetoType) => {
    const actions: ActionBarItemType[] = [
      {
        icon: <Icons.eye />,
        title: "Visualizar",
        onClick: () => {
          detalhesProjeto(projeto);
        },
      },
      {
        icon: <Icons.edit />,
        title: "Editar",
        onClick: () => {
          editarProjeto(projeto);
        },
        disabled: projeto.status !== ProjetoStatusRascunho && projeto.status !== ProjetoStatusPausado
      },
      {
        icon: <Icons.history />,
        title: "Historico",
        onClick: () => {
          pesquisarHistorico(projeto.id)
          setisModalProjetosHistoricoOpen(true)
        }
      },
      {
        icon: <Icons.close />,
        title: "Cancelar",
        onClick: () => {
          () => setProjetoCancelar(projeto)
        },
        disabled: !(
                    (projeto.status === ProjetoStatusRascunho ||
                    projeto.status === ProjetoStatusPausado ) 
                    // && !projeto.analista
                  )
      },
      // {
      //   icon: (
      //     <DropdownMenu>
      //       <DropdownMenuTrigger asChild>
      //         <Icons.ellipsis />
      //       </DropdownMenuTrigger>
      //       <DropdownMenuContent className="w-56">
      //         <DropdownMenuLabel>Ações</DropdownMenuLabel>
      //         <DropdownMenuItem
      //           onClick={() => setProjetoCancelar(projeto)}
      //           disabled={
      //             !(
      //               projeto.status == ProjetoStatusRascunho ||
      //               (projeto.status == ProjetoStatusAnalise &&
      //                 !projeto.analista)
      //             )
      //           }
      //         >
      //           Cancelar
      //         </DropdownMenuItem>
      //         <DropdownMenuItem onClick={() => exportarPontos(projeto)}>
      //           Download pontos
      //         </DropdownMenuItem>
      //       </DropdownMenuContent>
      //     </DropdownMenu>
      //   ),
      //   onClick: () => {},
      // },
    ];

    return <ActionBar actions={actions} />;
  };

  const colunas: Colunas<ProjetoType> = [
    {
      accessorKey: "id",
      header: "ID PROJETO",
    },
    {
      accessorKey: "cidade.nome",
      header: "CIDADE",
    },
    {
      accessorKey: "descricao",
      header: "DESCRIÇÃO",
    },
    {
      accessorKey: "createAt",
      header: "DATA SUBMISSÃO",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: "dataParecer",
      header: "DATA PARECER", 
      cell: ({ row }) => formatDateTwo(row.original.dataParecer , "short_date"),
    },
    {
      accessorKey: "status",
      header: "SITUAÇÃO",
      cell: ({ row }) => statusProjetoMap[row.original.status],
    },
    {
      id: "actions",
      cell: ({ row }) => renderActions(row.original),
    },
  ];

  const renderFiltroProjetos = () => (
    <FiltrosProjeto
      cidades={cidades}
      values={filtros}
      onPesquisar={() => pesquisarProjetos(pagination, filtros)}
      onChange={(filtros: FiltrosProjetoType) => {
        setFiltros(filtros);
      }}
      router={router}
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
        filtros={renderFiltroProjetos()}
        grid={
          <Grid
            colunas={colunas}
            data={projetos?.data}
            loading={loadingProjetos}
            page={pagination.pageIndex}
            count={projetos?.count || 0}
            limit={pagination.pageSize}
            setPagination={setPagination}
            projetos
          />
        }
      />
      <Dialog
        open={!!projetoCancelar}
        onOpenChange={(open) => {
          if (!open) {
            setProjetoCancelar(undefined);
          }
        }}
      >
        <DialogContent className="md:max-w-[768px]">
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
            <DialogDescription>
              Confirma o cancelamento do Projeto {projetoCancelar?.descricao}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4">
            <Button onClick={() => cancelarProjeto()}>Confirmar</Button>
            <Button
              onClick={() => {
                setProjetoCancelar(undefined);
              }}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProjetoPage;
