"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Mapa, MapaInterativo } from "@/components/map/map-component";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ConcessionariaAskModal } from "@/components/modal/modal-consecionaria-ask";
import ModalArquivosAnexos from "@/components/modal/concessionaria-axexos-modal";
import { notFound } from "next/navigation";
import {
    Arquivo,
  ExcluirPonto,
  InteractionResponse,
} from "@/services/concessionaria/excluir-ponto/types";
import useAsync from "@/hooks/useAsync";
import ExcluirPontoService from "@/services/concessionaria/excluir-ponto";
import { PosteResponseType2 } from "@/services/geral/types";
import { ProjetoPoste } from "@/types";
import { LoadingSpinner } from "@/components/spinner";
interface PosteLocal {
  codigo: string;
  lat: string;
  lon: string;
}

export default function VisualizaExclusao({
  params,
}: {
  params: { idExclusao: number };
}) {

  // Variaveis
  const { idExclusao } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [exclusao, setExclusao] = useState<ExcluirPonto>();
  const [openMap, setOpenMap] = useState<boolean>(true);
  const [openModalFileAttach, setOpenModalFileAttach] =
    useState<boolean>(false);
  const [openModalConcesionariaAsk, setOpenModalConcesionariaAsk] =
    useState<boolean>(false);
  const [title, setTitle] = useState<"Aprovado" | "Reprovado" | "Pausado">();
  const [historico, setHistorico] = useState<InteractionResponse[]>([]);
   const [loadingPostes, setLoadingPostes] = useState(true);
  const [allFiles, setAllFiles] = useState<Arquivo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [postes, setPostes] = useState<PosteResponseType2[]>([]);
      const [centro, setCentro] = useState<[number, number]>([
        -25.07155, -50.172205,
      ]);
  const [postesAdicionados, setPostesAdicionados] = useState<string[]>([]);
  const [postesProjeto, setPostesProjeto] = useState<ProjetoPoste[]>([]);

  // Funcoes
  // Se o idExclusao for um numero negativo ou nao for um numero cai em uma pagina not found personalizada
   const { loading: loadingMap, call: getPostes } =
    useAsync(async () => {
        setLoadingPostes(true);
        try {
          const response = await ExcluirPontoService.getExcluirPontoById(idExclusao);
  
          if(response?.postes === null) {
            setPostes([])
          } else{
              if (response && response.postes.length > 0) {
              const lat = Number(response.postes[0].lat);
              const lon = Number(response.postes[0].lon);
          
              if (!isNaN(lat) && !isNaN(lon)) {
                setCentro([lat, lon]);
              } else {
                console.warn("Centro inválido, usando fallback");
                setCentro([-25.07155, -50.172205]);
              }
          
              const postesValidos = response.postes.filter(
              (poste) =>
                !isNaN(Number(poste.lat)) &&
                !isNaN(Number(poste.lon)) &&
                poste.lat !== "" &&
                poste.lon !== ""
              );
                    
              setPostes(postesValidos as any);
              }
          }
          
        } catch (error) {
          console.error("Erro ao buscar postes:", error);
          setPostes([])
        } finally {
          setLoadingPostes(false);
        }
        
        
    }, []);

    useEffect(() => {
      getPostes()
    }, [])


  if (+params.idExclusao < 1 || isNaN(params.idExclusao)) {
    notFound();
  }

  const handleVoltar = useCallback(() => {
    router.push("/concessionaria/excluir-pontos");
  }, []);

  const { call: buscaDetalhesExclusao } = useAsync(async () => {
    const response = await ExcluirPontoService.getExcluirPontoById(idExclusao);
    setExclusao(response as any);
    setLoading(false)
  }, []);

  const { call: buscarHistoricoInteracaoExclusao } = useAsync(async () => {
    try {
      const response = await ExcluirPontoService.getHistorico(idExclusao);
      setHistorico(response);
      if(response?.length > 0){
          const arquivos = response.map((item) => item.arquivos).flat().filter((arquivo): arquivo is Arquivo => arquivo !== undefined);
          setAllFiles(arquivos);
      }
    } catch (error) {
      console.log("Erro ao carregar o historico:" +error)
      return []
    }
  }, []);

  useEffect(() => {
    buscaDetalhesExclusao();
  }, [buscaDetalhesExclusao]);

  useEffect(() => {
    buscarHistoricoInteracaoExclusao();
  }, [buscarHistoricoInteracaoExclusao]);

  // Renders
  const RenderModalArquivo = () => {
    return openModalFileAttach ? (
      <>
        <ModalArquivosAnexos
          isOpen={openModalFileAttach}
          files={allFiles}
          onClose={() => {
            setOpenMap(true);
            setOpenModalFileAttach(false);
          }}
        />
      </>
    ) : null;
  };

  const RenderModalConcesionariaAsk = () => {
    return openModalConcesionariaAsk && title && exclusao ? (
      <>
        <ConcessionariaAskModal
          title={title}
          id={+exclusao.id}
          open={openModalConcesionariaAsk}
          onOpenChange={() => {
            setOpenMap(true);
            setOpenModalConcesionariaAsk(false);
          }}
        />
      </>
    ) : null;
  };

  const RenderHeader = () => (
    <>
      <div className="flex justify-between items-center gap-5 my-3">
        <div className="flex items-end justify-center gap-5">
          <Button
            className="text-greenTertiary bg-white my-3"
            onClick={handleVoltar}
            variant="default"
            size="lg"
          >
            Voltar
          </Button>
        </div>

        <div className="flex items-end justify-center gap-5">
          <Button
            className="text-greenTertiary bg-white my-3"
            onClick={() => {
              setOpenMap(false);
              setOpenModalFileAttach(true);
            }}
            variant="default"
            size="lg"
          >
            Anexos
          </Button>
          <Button
            className="text-greenTertiary bg-white my-3"
            onClick={() => {
              setTitle("Aprovado");
              setOpenMap(false);
              setOpenModalConcesionariaAsk(true);
            }}
            variant="default"
            size="lg"
          >
            Aprovar
          </Button>
          <Button
            className="text-greenTertiary bg-white my-3"
            onClick={() => {
              setTitle("Reprovado");
              setOpenMap(false);
              setOpenModalConcesionariaAsk(true);
            }}
            variant="default"
            size="lg"
          >
            Reprovar
          </Button>
          <Button
            className="text-greenTertiary bg-white my-3"
            onClick={() => {
              setTitle("Pausado");
              setOpenMap(false);
              setOpenModalConcesionariaAsk(true);
            }}
            variant="default"
            size="lg"
          >
            Pausar
          </Button>
        </div>
      </div>
    </>
  );

  const RenderLoading = () => (
    <p className="text-white" >Carregando...</p>
  )

  // const RenderMap = () => {
  //   return (
  //     <>
  //       {exclusao && exclusao?.postes?.length > 0 && (
  //       <Mapa
  //         lista={exclusao.postes as any[]}
  //         centro={[
  //           parseFloat(exclusao.postes[0].lat) ?? -3.9,
  //           parseFloat(exclusao.postes[0].lon) ?? -38.5,
  //         ]}
  //         adicionados={[]}
  //         editavel={false}
  //       />
  //       )}
  //     </>
  //   )
  // }
  const RenderMap = () => {
          if (loadingPostes) {
            return <p className="text-white">Carregando mapa...</p>;
          }
          let postesValidos : any = []
          if(postes !== null){
             postesValidos = postes.filter(
              (poste) =>
                !isNaN(Number(poste.lat)) &&
                !isNaN(Number(poste.lon)) &&
                poste.lat !== "" &&
                poste.lon !== ""
            );
          }
  
          if (postesValidos.length === 0) {
            console.warn("Nenhum poste válido encontrado, não renderizando o mapa.");
            return <h2 className="text-white" >Mapa não contem postes!</h2>;
          }
      
          if (
            !Array.isArray(centro) ||
            centro.length !== 2 ||
            centro.some((value) => isNaN(value))
          ) {
            console.warn(
              "Centro inválido detectado, não renderizando o mapa:",
              centro
            );
            return null;
          }
      
          return (
            loadingPostes === false && (
              <>
                <MapaInterativo
                  lista={postesValidos as any}
                  centro={centro}
                  adicionados={postesProjeto} // aqui vai a lista de ProjetoPoste, se houver
                  onSetPostesAdicionados={() => {
                    // Função sem parâmetros conforme esperado pelo componente
                    console.log("Adicionar postes");
                  }}
                  onRemove={async (poste) => {
                    setPostesAdicionados(
                      postesAdicionados.filter((p) => p !== poste.codigo)
                    );
                  }}
                  postesAdicionados={postesAdicionados}
                />
              </>
            )
          );
        };

  if (loadingMap) {
          return <LoadingSpinner />;
  }

  return (
    <ScrollArea className="w-full h-full bg-greenTertiary px-5 rounded-lg mb-1.5">
      {RenderHeader()}
      {/* {loading ? RenderLoading() : RenderMap() } */}
      {RenderMap()}
      {RenderModalArquivo()}
      {RenderModalConcesionariaAsk()}
    </ScrollArea>
  );
}
