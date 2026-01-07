"use client"

import { ScrollArea } from "@/components/ui/scroll-area";
import { Mapa, MapaInterativo } from "@/components/map/map-component";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState} from "react";
import { notFound } from "next/navigation"
import { ExcluirPonto } from "@/services/concessionaria/excluir-ponto/types";
import useAsync from "@/hooks/useAsync";
import ExcluirPontoService from "@/services/concessionaria/excluir-ponto";
import { PosteResponseType2 } from "@/services/geral/types";
import { ProjetoPoste } from "@/types";
import { LoadingSpinner } from "@/components/spinner";
interface Poste {
  codigo: string;
  lat: string;
  lon: string;
}

export default function VisualizaExclusao( { params }: { params: { idExclusao: number } }) {

    // Variaveis
    const { idExclusao } = params;
    const router = useRouter();
    const [exclusao, setExclusao] = useState<ExcluirPonto>();
    const[loading, setLoading] = useState<boolean>(true);
    const [loadingPostes, setLoadingPostes] = useState(true);
    const [postes, setPostes] = useState<PosteResponseType2[]>([]);
    const [centro, setCentro] = useState<[number, number]>([
      -25.07155, -50.172205,
    ]);
    const [openMap, setOpenMap] = useState<boolean>(true);
    const [postesAdicionados, setPostesAdicionados] = useState<string[]>([]);
    const [postesProjeto, setPostesProjeto] = useState<ProjetoPoste[]>([]);

    // Funcoes
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
    
    // Se o idExclusao for um numero negativo ou nao for um numero cai em uma pagina not found personalizada
    if (+params.idExclusao < 1 || isNaN(params.idExclusao)) {
        notFound();
    }
    
    const handleVoltar = useCallback(() => {
        router.push("/concessionaria/excluir-pontos");
    }, []);

    // Renders
    const RenderHeader = () => (
      <Button className="text-greenTertiary bg-white my-6" onClick={handleVoltar} variant="default" size="lg">
        Voltar
      </Button>
    )

    const RenderLoading = () => (
      <p className="text-white" >Carregando...</p>
    )

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
        {RenderMap()}
      </ScrollArea>
    )
}