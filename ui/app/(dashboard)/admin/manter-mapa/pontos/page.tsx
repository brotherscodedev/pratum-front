"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pesquisa } from "@/components/crud/pesquisa";
import { Colunas, Notificacao, Poste } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, formatDateApi } from "@/lib/utils";
import { Grid } from "@/components/crud/grid";

import { addDays } from "date-fns";
import { Icons } from "@/components/icons";
import { FiltrosPontos, FiltrosPontosType } from "./filtros";
import { PagedResponseType } from "@/services/http";
import cidadeService, {
  CidadeBasicResponseType,
} from "@/services/cidade-service";
import { PaginationState } from "@tanstack/react-table";
import useAsync from "@/hooks/useAsync";
import { useRouter } from "next/navigation";
import ActionBar, { ActionBarItemType } from "@/components/action-bar";
import adminService, {
  ConcessionariaType,
  PontosResponseType,
} from "@/services/admin-service";
import { CidadeResponseType } from "@/services/cidade-service/types";

const breadcrumbItems = [{ title: "Manter Mapa", link: "/admin/manter-mapa" }];

const Page = ({ tipo: string }: any) => {
  const router = useRouter();
  const { toast } = useToast();

  const [filtros, setFiltros] = useState<FiltrosPontosType>({
    cidadeCodigo: "",
    concessionariaId: "",
    posteCodigo: "",
    endereco: "",
  });

  const [pontos, setPontos] = useState<PagedResponseType<Poste>>();
  const [cidades, setCidades] = useState<CidadeResponseType[]>();
  const [concessionarias, setConcessionarias] =
    useState<ConcessionariaType[]>();

  const [cidadesCodigo, setCidadesCodigo] = useState<
    Map<string, CidadeResponseType>
  >(new Map());

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const encodeFilters = useCallback(
    (filtros: FiltrosPontosType) => {
      return {
        ...filtros,
      };
    },
    [filtros, formatDateApi]
  );

  const { loading, call: listPontos } = useAsync(
    async (pagination: PaginationState, filtros: FiltrosPontosType) => {
      const page = {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
      };

      const encodedFilters = encodeFilters(filtros);
      try {
        const response = await adminService.buscarPontos(page, encodedFilters);
      setPontos(response); 
     //   const response = await adminService.sendFile(page, encodedFilters);
     //   setPontos(response);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao buscar pontos paginados",
          variant: "erro",
          position: "top"
        });
      }
    },
    []
  );

  const { call: listCidades } = useAsync(async () => {
    const response = await cidadeService.getCidadesPorCodigo();
    setCidades(response);

    setCidadesCodigo(new Map(response.map((c) => [c.codigoIbge, c])));

    const concessionarias = await adminService.getConcessionarias();
    setConcessionarias(concessionarias);
  }, []);

  useEffect(() => {
    listCidades();
  }, [listCidades]);

  useEffect(() => {
    listPontos(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize, listPontos]);

  const handleEditarNotificacao = useCallback((idNotificacao: number) => {
    router.push(`/concessionaria/notificacoes/${idNotificacao}`);
  }, []);

  const handleDetalhesNotificacao = useCallback((idNotificacao: number) => {
    //TODO: criar detalhes da notificação
    alert(`Detalhes da notificacao - ${idNotificacao}`);
  }, []);

  const renderActions = (poste: Poste) => {
    const actions: ActionBarItemType[] = [
      {
        icon: <Icons.edit />,
        title: "Editar",
        onClick: () => {},
      },
      {
        icon: <Icons.alert />,
        title: "Detalhes",
        onClick: () => {},
      },
    ];

    return <ActionBar actions={actions} />;
  };

  const colunas: Colunas<Poste> = [
    {
      accessorKey: "codigo",
      header: "ID POSTE ",
    },
    {
      accessorKey: "cidadeCodigo",
      header: "CÓDIGO CIDADE",
    },
    {
      accessorKey: "cidadeCodigo",
      header: "CÓDIGO CIDADE",
      cell: ({ row }) =>
        cidadesCodigo.get(row.original.cidadeCodigo)?.nome || "",
    },
    {
      id: "actions",
      cell: ({ row }) => renderActions(row.original),
    },
  ];

  return (
    <Pesquisa
      breadcrumbItems={breadcrumbItems}
      titulo="Manter mapa"
      botoes={[
        <Button
          title="Adicionar Multa"
          className="btn-primary"
          onClick={() => router.push("/concessionaria/notificacoes/novo")}
        >
          Nova Notificação{" "}
        </Button>,
      ]}
      filtros={[
        <FiltrosPontos
          onPesquisar={() => listPontos(pagination, filtros)}
          cidades={cidades}
          concessionarias={concessionarias}
          values={filtros}
          onChange={setFiltros}
        />,
      ]}
      grid={
        <Grid
          colunas={colunas}
          data={pontos?.data}
          loading={loading}
          page={pagination.pageIndex}
          count={pontos?.count || 0}
          limit={pagination.pageSize}
          setPagination={setPagination}
        />
      }
    />
  );
};

export default Page;
