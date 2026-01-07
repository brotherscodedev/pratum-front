"use client"
import { Icons } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Colunas,
  usuariosFiltro,
  usuariosListados,
} from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import useAsync from "@/hooks/useAsync";
import { Grid } from "@/components/crud/grid";
import ActionBar, { ActionBarItemType } from "@/components/action-bar";
import IconGfonts from "@/components/icon-gfonts/icon";
import { Pesquisa } from "@/components/crud/pesquisa";
import FiltrosUsuarios from "./filtros";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import UsuarioService from "@/services/admin-service/usuario";
import HistoricoUsuarioModal from "./modal-historico-usuarios";
import { empresasMock } from "@/constants/data";

const breadcrumbItems = [{ title: "Exclusão de Pontos", link: "/concessionaria/excluir-pontos" }];

export default function page() {

  // Varriaveis e constantes
  const router = useRouter()

  const colunas: Colunas<usuariosListados> = [
    {
      accessorKey: "nome", 
      header: "nome",
    },
    {
      accessorKey: "email",
      header: "email",
    },
    {
      accessorKey: "empresa",
      header: "empresa",
    },
    {
      accessorKey: "concessionaria",
      header: "concessionaria",
    },
    {
      accessorKey: "perfil",
      header: "perfil",
    },
    {
      accessorKey: "situacao",
      header: "situacao",
    },
    {
      id: "actions",
      cell: ({ row }) => renderActions(row.original),
    },
  ];

  const [usuarios, setUsuarios] = useState<usuariosListados[]>([]) // excluirPontosMock  <ExcluirPonto[] | null>
  const [count, setCount] = useState<number>(0) // excluirPontosMock
  const [filtros, setFiltros] = useState<Partial<usuariosFiltro>>({
    ocupante: "",
    concessionaria: "",
    perfil: "",
    cpf: "",
    //situacao: ""
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [historico, setHistorico] = useState([])
  const [isModalUsuarioHistoricoOpen, setisModalUsuarioHistoricoOpen] = useState(false)
  
  
  // Funcoes
  const encodeFilters = useCallback(
    (filtros: Partial<usuariosFiltro>) => {
           return {
             ...filtros,
      };
    },
    [filtros]
  );

  const {  call: pesquisarHistorico } = useAsync(async (id: number) => {
    try {
      
      const historicoResponse = await UsuarioService.getHistoricoUsuarioById(id);
      setHistorico(historicoResponse as any)
      
    } catch (error) {
      toast({
        description: "Não foi possível carregar o historico do Usuario",
        variant: "erro",
      });
    }
  }, []);

  const { loading,  call: listarUsuarios } = 
    useAsync(async (pagination: PaginationState, filtros:Partial<usuariosFiltro>) => {
      try {
        const encodedFilters = encodeFilters(filtros);
        const response = await UsuarioService.getUsuarios({limit: pagination.pageSize, page: pagination.pageIndex}, encodedFilters)
        setUsuarios(response as any)
        
      } catch (error) {
        toast({ description: "Não foi possível carregar os usuarios", variant: "erro"});
      }
  }, []);

  useEffect(() => {
      listarUsuarios(pagination, filtros);
    }, [pagination.pageIndex, pagination.pageSize]);

  const handleVisualizar = useCallback((id : number) => {
    router.push(`/admin/usuarios/visualizar/${id}`);
  }, []);

  const handleEditar = useCallback((id : number) => {
    router.push(`/admin/usuarios/editar/${id}`);
  }, []);

  // Renders
  const renderActions = (usuario : usuariosListados) => {
    const actions: ActionBarItemType[] = [
      {
        icon: <IconGfonts id="history" />,
        title: "Histórico",
        onClick: () => {
          //setUsuarioIdHistorico(usuario.id)
          pesquisarHistorico(usuario.id)
          setisModalUsuarioHistoricoOpen(true)
        }
      },
      {
        icon: <Icons.eye />,
        title: "Visualizar",
        onClick: () => handleVisualizar(usuario.id)
      },
      {
        icon: <IconGfonts id="touch_app" />, //edit
        title: "Editar",
        onClick: () => handleEditar(usuario.id)
      }
    ];
    return <ActionBar actions={actions} />
  };

  const renderFiltroUsuarios = () => (
      <FiltrosUsuarios
        values={filtros as usuariosFiltro}
        onPesquisar={() => {
          console.log(filtros)
          listarUsuarios(pagination, filtros)
        } }
        onChange={(filtros: usuariosFiltro) => {
          setFiltros(filtros);
        }}
        router={router}
      />
  );

  const RenderFilters = () => {
    return (
      <Pesquisa
          breadcrumbItems={[]}
          titulo="Usuarios"
          filtros={renderFiltroUsuarios()}
          grid={
            <Grid
              colunas={colunas}
              data={usuarios}
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

  const RenderModalHistoricoUsuarios = () => {
    return (
      <>
        <HistoricoUsuarioModal
          isOpen={isModalUsuarioHistoricoOpen}
          onClose={() => setisModalUsuarioHistoricoOpen(false)}
          historico={historico as any}
        />
      </>
    )
  }

  return (
    <ScrollArea className="h-full">
      {RenderFilters()}   
      {RenderModalHistoricoUsuarios()}
    </ScrollArea>
  );
}

