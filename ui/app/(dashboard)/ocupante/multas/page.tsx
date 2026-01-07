"use client";

import React, { useCallback, useEffect, useState } from "react";
import { addDays } from "date-fns";
import { formatDate } from "@/lib/utils";
import {
  Colunas,
} from "@/types";
import { formatCurrency, formatDateApi } from '@/lib/utils'
import FiltrosMulta from '@/app/(dashboard)/ocupante/multas/filtros'
import { Grid } from "@/components/crud/grid";
import { Pesquisa } from "@/components/crud/pesquisa";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import ActionBar, { ActionBarItemType } from "@/components/action-bar";
import multaService, { MultaResponseType } from "@/services/ocupante/multa-service";

import useAsync from "@/hooks/useAsync";
import { PagedResponseType } from "@/services/http/types";
import { PaginationState } from "@tanstack/react-table";

import { FiltrosMultaType } from "./types";
import VisualizarMulta from "./visualizar-multa-modal";
import { OcupanteBasicResponseType } from "@/services/ocupante/ocupante-service/types";


const breadcrumbItems = [{ title: "Multas", link: "/ocupante/multas" }];

export default function page() {

  const { toast } = useToast();
  const [multaParaVisualizar, setMultaParaVisualizar] = useState<MultaResponseType | undefined>();
  const [multas, setMultas] = useState<PagedResponseType<MultaResponseType>>();
  const [ocupantes, setOcupantes] = useState<OcupanteBasicResponseType[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filtros, setFiltros] = useState<FiltrosMultaType>({
    // ocupanteId: null,
    motivo: undefined,
    vencimentoDe: new Date(),
    vencimentoAte: addDays(new Date(), 30),
  })

  const encodeFilters = useCallback((filtros: FiltrosMultaType) => {
    return {
      ...filtros,
      vencimentoDe: filtros.vencimentoDe ? formatDateApi(filtros.vencimentoDe) : null,
      vencimentoAte: filtros.vencimentoAte ? formatDateApi(filtros.vencimentoAte) : null
    }
  }, [filtros, formatDateApi]);

  const { loading: loadingMultas, call: pesquisarMultas } = useAsync(async (pagination: PaginationState, filtros: FiltrosMultaType) => {
    try {
      const encodedFilters = encodeFilters(filtros);
      const response = await multaService.getMultas({limit: pagination.pageSize, page: pagination.pageIndex}, encodedFilters)
      if (Array.isArray(response)) {
        setMultas(undefined);
      } else {
        setMultas(response);
      }
    } catch (error) {
      toast({ description: "Não foi possível carregar as multas", variant: "erro", position: "top"});
    }
  }, []);

  useEffect( () => {
    pesquisarMultas(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize, pesquisarMultas])

  const visualizarMulta = useCallback((multa: MultaResponseType) => {
    //TODO: estou fazendo assim porque não tem o endpoint de retornar uma única multa.O correto era recarregar o multa selecionada para atualizar os dados.
    setMultaParaVisualizar(multa);
  }, []);

  const renderActions = (idMulta: number) => {

  const actions: ActionBarItemType[] = [
    {
      icon: <Icons.download />,
      title: 'Baixar boleto',
      onClick: () => {
        const multaEncontrada = multas?.data.find((multa) => multa.id === idMulta);
        window.open(multaEncontrada?.arquivo.url)
      }
    },
    {
      icon: <Icons.eye />,
      title: 'Visualizar multa',
      onClick: () => {
        const multaEncontrada = multas?.data.find((multa) => multa.id === idMulta);
        if (multaEncontrada) visualizarMulta(multaEncontrada);
      }
    },
  ]

  return (
    <ActionBar actions={actions} />
  )
}

  const colunas: Colunas<MultaResponseType> = [
    {
      accessorKey: "vencimento",
      header: "VENCIMENTO",
      cell: ({ row }) => formatDate(row.original.vencimento),
    },
    {
      accessorKey: "valor",
      header: "VALOR",
      cell: ({row}) => formatCurrency(row.original.valor),
    },
    {
      accessorKey: "motivo",
      header: "MOTIVO",
    },
    {
      id: "actions",
      cell: ({ row }) => renderActions(row.original.id),
    },
  ];

  const renderFiltroMultas = () =>(
    <FiltrosMulta
      values={filtros}
      ocupantes={ocupantes}
      onPesquisar={() => pesquisarMultas(pagination, filtros)}
      onChange={(filtros: FiltrosMultaType) => {
        setFiltros(filtros)
      }}
    />
  )

  const renderVisualizarMulta = () => {
    return multaParaVisualizar
      ? <VisualizarMulta multa={multaParaVisualizar} onClose={() => setMultaParaVisualizar(undefined)}/>
      : null;
  }

  return (
    <>
      <Pesquisa
        breadcrumbItems={breadcrumbItems}
        titulo="Multas"
        botoes={null}
        filtros={renderFiltroMultas()}
        grid={
          <Grid
            colunas={colunas}
            data={multas?.data}
            loading={loadingMultas}
            page={pagination.pageIndex}
            count={multas?.count || 0}
            limit={pagination.pageSize}
            setPagination={setPagination}
          />
        }
      />
      {renderVisualizarMulta()}
    </>
  );
}