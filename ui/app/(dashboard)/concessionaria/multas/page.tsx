"use client";

import { useCallback, useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Grid } from "@/components/crud/grid";
import { Pesquisa } from "@/components/crud/pesquisa";
import { Icons } from "@/components/icons";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  Colunas,
} from "@/types";
import { formatCurrency, formatDateApi } from '@/lib/utils';
import FiltrosMulta from '@/app/(dashboard)/concessionaria/multas/filtros';
import { FiltrosMultaType } from "./types";
import { addDays } from "date-fns";
import { UserTypeConcessionaria } from "@/constants/siga";
import { useToast } from "@/components/ui/use-toast";
import ActionBar, { ActionBarItemType } from "@/components/action-bar";
import CreateModalFormMulta from "./multa-create-modal-form";
import VisualizarMulta from "./visualizar-multa-modal";
import { AlertModal } from "@/components/modal/alert-modal";
import multaService, { MultaResponseType } from "@/services/concessionaria/multa-service";
import concessionariaService, { OcupanteBasicResponseType } from "@/services/concessionaria/concessionaria-service";

import useAsync from "@/hooks/useAsync";
import { PagedResponseType } from "@/services/http/types";
import { PaginationState } from "@tanstack/react-table";
import { UsuarioContext } from "@/app/context";

const breadcrumbItems = [{ title: "Multas", link: "/concessionaria/multas" }];

export default function page() {

  const { toast } = useToast();
  const user = useContext(UsuarioContext);
  const isConcessionaria = user?.type == UserTypeConcessionaria;
  const [isCriandoNovaMulta, setIsCriandoNovaMulta] = useState<boolean>(false);
  const [multaParaVisualizar, setMultaParaVisualizar] = useState<MultaResponseType | undefined>();
  const [multaParaRemover, setMultaParaRemover] = useState<MultaResponseType | undefined>();
  const [multas, setMultas] = useState<PagedResponseType<MultaResponseType>>();
  const [ocupantes, setOcupantes] = useState<OcupanteBasicResponseType[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filtros, setFiltros] = useState<FiltrosMultaType>({
    ocupanteId: null,
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
      if (Array.isArray(response) && response.length === 0) {
        // Se é um array vazio, não atualizar o estado
        return;
      }
      setMultas(response as PagedResponseType<MultaResponseType>);
    } catch (error) {
      toast({
        title: "Erro", 
        description: "Não foi possível carregar as multas", 
        variant: "erro",
        position: "top"
      });
    }
  }, []);

  const { call: listOcupantes } = useAsync(async () => {
    try {
      const response = await concessionariaService.getOcupantes();
      setOcupantes(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect( () => {
    listOcupantes();
  }, [listOcupantes]);

  useEffect( () => {
    pesquisarMultas(pagination, filtros);
  }, [pagination.pageIndex, pagination.pageSize, pesquisarMultas])

  const getOcupanteNameById = (empresaOcupanteId: number) => {
    const ocupanteFound = ocupantes.find((o) => o.id === empresaOcupanteId)
    return ocupanteFound ? ocupanteFound.descricao : undefined
  }

  const removerMulta = useCallback(async (id: number) => {
    try {
      await multaService.deleteMulta(id)
      toast({
        title: "Sucesso",
        description: "Multa removida com sucesso!", 
        variant: "sucesso",
        position: "top" 
      });
    } catch (error) {
      toast({ 
        title: "Erro",
        description: "Não foi possível excluir a multa", 
        variant: "erro",
        position: "top"
      });
    }
  }, []);

  const visualizarMulta = useCallback((multa: MultaResponseType) => {
    //TODO: estou fazendo assim porque não tem o endpoint de retornar uma única multa.O correto era recarregar o multa selecionada para atualizar os dados.

    setMultaParaVisualizar(multa);
  }, []);

  const renderActions = (idMulta: number) => {

  const actions: ActionBarItemType[] = [
    {
      title: 'Baixar boleto',
      icon: <Icons.download />,
      onClick: () => {
        const multaEncontrada = multas?.data.find((multa) => multa.id === idMulta);
        window.open(multaEncontrada?.arquivo.url)
      }
    },
    {
      title: 'visualizar multa',
      icon: <Icons.eye />,
      onClick: () => {
        const multaEncontrada = multas?.data.find((multa) => multa.id === idMulta);
        if (multaEncontrada) visualizarMulta(multaEncontrada);
      }
    },
    {
      title: 'remover multa',
      icon: <Icons.trash />,
      onClick: () => {
        const multaEncontrada = multas?.data.find((multa) => multa.id === idMulta);

        if (!multaEncontrada?.arquivo) {
          toast({
            title: "Alerta",
            description: "A multa não possui boleto", 
            variant: "advertencia",
            position: "top"
          });
        }

        setMultaParaRemover(multaEncontrada)
      }
    },
  ]

  return (
    <ActionBar actions={actions} />
  )
}

  const colunas: Colunas<MultaResponseType> = [
    {
      accessorKey: "empresaOcupanteId",
      header: "OCUPANTE",
      cell: ({row}) => getOcupanteNameById(row.original.empresaOcupanteId),
    },
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

  const handleSalvar = useCallback(() => {
    setIsCriandoNovaMulta(false);
    pesquisarMultas(pagination, filtros);
  }, [pagination, filtros]);

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

  const renderBotaoNovaMulta = () => {

    return isConcessionaria
      ? <Button
          className=""
          title="Adicionar Multa"
          onClick={() => setIsCriandoNovaMulta(true)}>
            <Icons.add className="mr-2" />
            Nova Multa
        </Button>
      : null;
  }

  const renderFormNovaMulta = () => {
    return isCriandoNovaMulta
      ? <CreateModalFormMulta onSave={handleSalvar} onClose={() => setIsCriandoNovaMulta(false)} />
      : null;
  }

  const renderVisualizarMulta = () => {
    return multaParaVisualizar
      ? <VisualizarMulta multa={multaParaVisualizar} onClose={() => setMultaParaVisualizar(undefined)}/>
      : null;
  }

  const renderConfirmarRemoverMulta = () => {
    return multaParaRemover
      ? <AlertModal
          title="Remover multa"
          description={
            `Tem certeza que deseja remover a multa do ocupante "${getOcupanteNameById(multaParaRemover?.empresaOcupanteId!)}" criada em ${formatDateTime(multaParaRemover.createdAt)} no valor de ${formatCurrency(multaParaRemover.valor)}?`
          }
          loading={false}
          isOpen={true}
          onConfirm={()=> {
            removerMulta(multaParaRemover.id);
            setMultaParaRemover(undefined);
            pesquisarMultas(pagination, filtros);
          }}
          onClose={() => {
            setMultaParaRemover(undefined);
          }}/>
      : null;
  }


  return (
    <>
      <Pesquisa
        breadcrumbItems={breadcrumbItems}
        titulo="Multas"
        botoes={renderBotaoNovaMulta()}
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
      {renderFormNovaMulta()}
      {renderVisualizarMulta()}
      {renderConfirmarRemoverMulta()}
    </>
  );
}