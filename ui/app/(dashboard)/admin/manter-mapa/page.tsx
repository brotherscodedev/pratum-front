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
import { ScrollArea } from "@/components/ui/scroll-area";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

// Renderizar o mapa apenas no client para evitar erros de SSR
const Mapa = dynamic(() => import("@/components/map/map"), { ssr: false });

const breadcrumbItems = [{ title: "Manter Mapa", link: "/admin/manter-mapa" }];

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [filtros, setFiltros] = useState<FiltrosPontosType>({
    cidadeCodigo: "",
    concessionariaId: "",
    posteCodigo: "",
    endereco: "",
  });

  const [pontos, setPontos] = useState<Poste[]>();
  const [cidades, setCidades] = useState<CidadeResponseType[]>();
  const [cidade, setCidade] = useState<CidadeResponseType>();
  const [concessionarias, setConcessionarias] =
    useState<ConcessionariaType[]>();

  const [cidadesCodigo, setCidadesCodigo] = useState<
    Map<string, CidadeResponseType>
  >(new Map());

  const encodeFilters = useCallback(
    (filtros: FiltrosPontosType) => {
      return {
        ...filtros,
      };
    },
    [filtros, formatDateApi]
  );

  const [centro, setCentro] = useState({ lat: "0", lon: "0" });

  const { loading, call: listPontos } = useAsync(
    async (filtros: FiltrosPontosType) => {
      if (!filtros.cidadeCodigo || !filtros.concessionariaId) {
        toast({
          description: "Selecione uma cidade e uma concessionária",
          variant: "advertencia",
          position: "top",
        });

        setPontos([]);
        return;
      }

      const encodedFilters = encodeFilters(filtros);
      try {
        const response = await adminService.getAllPontos(encodedFilters);
        setPontos(response);

        if (response.length > 0) {
          setCentro({
            lat: response[0].lat,
            lon: response[0].lon,
          });
        } else {
          setCentro({
            lat: cidade?.centroLat ?? "0",
            lon: cidade?.centroLon ?? "0",
          });
        }
      } catch (error) {
        toast({
          description: "Não foi possível carregar as notificações",
          variant: "erro",
        });
      }
    },
    []
  );

  const showMap = !!pontos && pontos.length > 0;
  const { call: listCidades } = useAsync(async () => {
    const response = await cidadeService.getCidadesPorCodigo();
    setCidades(response);

    setCidadesCodigo(new Map(response.map((c) => [c.codigoIbge, c])));

    const concessionarias = await adminService.getConcessionarias();
    setConcessionarias(concessionarias);
  }, []);

  useEffect(() => {
    listCidades();
  }, []);

  const handleEditarNotificacao = useCallback((idNotificacao: number) => {
    router.push(`/concessionaria/notificacoes/${idNotificacao}`);
  }, []);

  const handleDetalhesNotificacao = useCallback((idNotificacao: number) => {
    //TODO: criar detalhes da notificação
    alert(`Detalhes da notificacao - ${idNotificacao}`);
  }, []);


    const exportarPontos = async () => {
      try {
        window.open(
          `/api/backend?uri=admin/pontos-exportar`,
          "_blank"
        );
      } catch (error) {
        console.log(error);
        toast({
          description: "Não foi possível exportar os pontos",
          variant: "erro",
        });
      }
    };

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
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-4">
          <Heading title="Manter Mapa" description="" />
          <FiltrosPontos
            onPesquisar={() => listPontos(filtros)}
            cidades={cidades}
            concessionarias={concessionarias}
            values={filtros}
            onChange={setFiltros}
            setCidade={setCidade}
          />
          <div className="flex grow justify-end space-x-4">
            <Button title="Download pontos" onClick={exportarPontos}>
              <Icons.download />
            </Button>
            <Button onClick={() => {router.push("/admin/manter-mapa/pontos/upload/SUBMETER")}}>Submeter</Button>
            <Button onClick={() => {}}>Alterar</Button>
            <Button onClick={() => {}}>Remover</Button>
          </div>
        </div>
        <Separator />
        <div className="w-300 h-300">
          {showMap && (
            <Mapa
              lista={pontos || []}
              centro={[Number(centro.lat), Number(centro.lon)]}
              adicionados={[]}
              editavel={false}
            />
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default Page;
