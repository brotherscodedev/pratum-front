"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Pesquisa } from "@/components/crud/pesquisa";
import {
  Colunas,
} from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { formatDateApi } from "@/lib/utils";
import { Grid } from "@/components/crud/grid";
import { addDays } from "date-fns";
import { PagedResponseType } from "@/services/http";
import notificacaoService, { NotificacaoResponseType } from "@/services/concessionaria/notificacao-service";
import useAsync from "@/hooks/useAsync";
import { PaginationState } from "@tanstack/react-table";
import { FiltrosRelatoriosType } from "./types";
import cidadeService, { CidadeBasicResponseType } from "@/services/cidade-service";
import ActionBar, { ActionBarItemType } from "@/components/action-bar";
import { Icons } from "@/components/icons";
import { ProjetoType } from "@/services/projeto-service/types";

const breadcrumbItems = [{ title: "Relatórios", link: "/ocupante/relatorios" }];

const RelatoriosPage = () => {
  const { toast } = useToast();

  const [filtros, setFiltros] = useState<FiltrosRelatoriosType>({
    cidadeId: "",
    motivo: "",
    prazoDe: new Date(),
    prazoAte: addDays(new Date(), 30),
  });

  const [relatorios, setRelatorios] = useState<PagedResponseType<NotificacaoResponseType>>();
  const [cidades, setCidades] = useState<CidadeBasicResponseType[]>();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const encodeFilters = useCallback((filtros: FiltrosRelatoriosType) => {
    return {
      ...filtros,
      prazoDe: filtros.prazoDe ? formatDateApi(filtros.prazoDe) : null,
      prazoAte: filtros.prazoAte ? formatDateApi(filtros.prazoAte) : null
    }
  }, [filtros, formatDateApi]);

  const { loading, call: listNotificacoes } = useAsync(async (pagination: PaginationState, filtros: FiltrosRelatoriosType) => {
    const page = {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    }

    const encodedFilters = encodeFilters(filtros);
    try {
      const response = await notificacaoService.getNotificacoes(page, encodedFilters);
      if (Array.isArray(response)) {
        setRelatorios(undefined);
      } else {
        setRelatorios(response);
      }
    } catch (error) {
      toast({ 
        title: "Erro",
        description: "Não foi possível carregar os relatórios", 
        variant: "erro",
        position: "top"
      })
    }
  }, []);

  const {call: listCidades} = useAsync(async () => {
    const response = await cidadeService.getCidadesBasicList();
    setCidades(response)
  }, []);

  useEffect( () => {
    listCidades();
  }, [listCidades]);

  useEffect( () => {
    listNotificacoes(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize, listNotificacoes])

  const marcarNotificacaoLida = useCallback( async (notificacaoId: number) => {
    // Método markRead não disponível no serviço de concessionaria
    // notificacaoService.markRead(notificacaoId)
    // .then(() => toast({
    //   title: "Alerta",
    //   description: "Relatório lido.", 
    //   variant: "sucesso",
    //   position: "top"
    // }))
    // .catch(() => toast({
    //   title: "Erro",
    //   description: "Não foi possível marcar o relatório como lido.", 
    //   variant: "erro",
    //   position: "top"
    // }))
  }, [])

  const renderActions = (idNotificacao: number) => {

    const actions: ActionBarItemType[] = [
      {
        icon: <Icons.eye />,
        title: 'Marcar como lido',
        onClick: () => {
          marcarNotificacaoLida(idNotificacao);
          listNotificacoes(pagination, filtros);
        }
      },
    ]

    return (
      <ActionBar actions={actions} />
    )
  }

  const colunas: Colunas<ProjetoType> = [
    {
      accessorKey: "ocupante",
      header: "OCUPANTE",
    },
    {
      accessorKey: "municipio",
      header: "MUNICÍPIO",
    },
    {
      accessorKey: "quantidadeDePontos",
      header: "PONTOS",
    },
    {
      accessorKey: "eqde",
      header: "EQ DE",
    },
    {
      accessorKey: "valorUnEd",
      header: "VALOR UN",
    },
    {
      accessorKey: "eqee",
      header: "EQ EE",
    },
    {
      accessorKey: "valorUnEe",
      header: "VALOR UN",
    },
    {
      accessorKey: "valorTotal",
      header: "VALOR TOTAL",
    },
  ];

  return (
    <Pesquisa
      breadcrumbItems={breadcrumbItems}
      titulo="Relatórios"
      botoes={[]}
      // filtros={[
      //   <FiltrosNotificacaoRelatorios
      //     onPesquisar={() => listNotificacoes(pagination, filtros)}
      //     cidades={cidades}
      //     values={filtros}
      //     onChange={setFiltros}
      //   />,
      // ]}
      filtros={null}
      grid={
        <Grid
          colunas={colunas}
          data={relatorios?.data}
          loading={loading}
          page={pagination.pageIndex}
          count={relatorios?.count || 0}
          limit={pagination.pageSize}
          setPagination={setPagination}
        />
      }
    />
  );
};

export default RelatoriosPage;