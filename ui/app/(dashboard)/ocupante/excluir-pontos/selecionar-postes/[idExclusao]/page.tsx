"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ConfirmRemovePoste } from "@/components/modal/confirm-remove-poste";
import { useToast } from "@/components/ui/use-toast";
import { AtachFileNotificationModal } from "@/components/modal/atach-file-notification-modal";
import { notFound } from "next/navigation";
import useAsync from "@/hooks/useAsync";
import ExcluirPontoService from "@/services/ocupante/excluir-ponto";
import { BasicResponseType } from "@/services/http";
import geralService from "@/services/geral";
import { ProjetoResponseType } from "@/services/projeto-service";
import { ProjetoPoste, Poste } from "@/types";
import { CidadeResponseType } from "@/services/cidade-service/types";
import { PosteResponseType, PosteResponseType2 } from "@/services/geral/types";
import { ArquivoRequestType } from "@/services/projeto-service/types";
import MapaInterativo from "@/components/map/new/map-new";
import { LoadingSpinner } from "@/components/spinner";

interface PosteSimples {
  codigo: string;
  lat: string;
  lon: string;
}

interface File {
  nome: string 
  tamanho: number
  key: string 
  url: string
}

export default function VisualizaExclusao({
  params,
}: {
  params: { idExclusao: number };
}) {
  // const
  const { idExclusao } = params;
  const router = useRouter();
  const { toast } = useToast();
  const emptyFile = {nome: "", tamanho: 0, key: "", url: ""}
  const [file, setFile] = useState<ArquivoRequestType | undefined>(undefined);  
  const [postesAdicionados, setPostesAdicionados] = useState<string[]>([]);
  //const [postes, setPostes] = useState<PosteResponseType[]>([]); // modelo inicial
  const [postes, setPostes] = useState<Poste[]>([]); // usando tipo Poste global
  const [municipios, setMunicipios] = useState<BasicResponseType[]>([]);
  const [centro, setCentro] = useState<[number, number]>([
    -25.07155, -50.172205,
  ]); // [0,0]
  const [projeto, setProjeto] = useState<ProjetoResponseType>();
  const [cidade, setCidade] = useState<CidadeResponseType>();
  const [postesProjeto, setPostesProjeto] = useState<ProjetoPoste[]>([]);
  const [municipio, setMunicipio] = useState("");
  const [openMap, setOpenMap] = useState<boolean>(true);
  const [openModalFileAttach, setOpenModalFileAttach] = useState<boolean>(false);
  const [openModalConfirmRemovePost, setOpenModalConfirmRemovePost] = useState<boolean>(false);
  const [loadingPostes, setLoadingPostes] = useState(true);

  // Funcoes
  // Se o idExclusao for um numero negativo ou nao for um numero cai em uma pagina not found personalizada
  // Se o idExclusao for um numero negativo ou nao for um numero cai em uma pagina not found personalizada
  if (+params.idExclusao < 1 || isNaN(params.idExclusao)) {
    notFound();
  }

  const { loading: loading, call: getPostes } =
    useAsync(async () => {
      setLoadingPostes(true);
      try {
        const response = await ExcluirPontoService.getPontosOcupante();
        if (response && response.length > 0) {
          const lat = Number(response[0].lat);
          const lon = Number(response[0].lon);

          if (!isNaN(lat) && !isNaN(lon)) {
            setCentro([lat, lon]);
          } else {
            console.warn("Centro inválido, usando fallback");
            setCentro([-25.07155, -50.172205]);
          }

          const postesValidos = response.filter(
            (poste) =>
              !isNaN(Number(poste.lat)) &&
              !isNaN(Number(poste.lon)) &&
              poste.lat !== "" &&
              poste.lon !== ""
          ).map((poste): Poste => ({
            codigo: poste.codigo,
            cidadeCodigo: poste.cidadeCodigo,
            lat: poste.lat,
            lon: poste.lon,
            situacao: poste.situacao,
            possuiEquipamento: false,
            possuiEMS: false,
            descidaSub: false,
            caracteristicas: "",
            concessionariaId: poste.concessionariaId
          }));

          setPostes(postesValidos);
        }
      } catch (error) {
        console.error("Erro ao buscar postes:", error);
      } finally {
        setLoadingPostes(false);
      }
   
  }, []);

  useEffect(() => {
    getPostes();
  }, []);

  const { loading: loadingCidades, call: pesquisarCidades } =
    useAsync(async () => {
      try {
        const response = await geralService.getCidades();
        setMunicipios(response);
      } catch (error) {
        toast({
          description: "Não foi possível carregar as Cidades",
          variant: "erro",
          position: "top",
        });
      }
    }, []);

  useEffect(() => {
    pesquisarCidades();
  }, []);

  
  const handleSalvar2 = async (file: any, postesAdicionados: any ) => {
    
      console.log("File:", file);
      console.log("Postes Adicionados:", postesAdicionados);
      console.log("Município:", municipio);
      
      // Validação: verificar se município foi selecionado
      if (!municipio || municipio === "") {
        toast({
          title: "Erro",
          description: "Selecione um município antes de salvar",
          variant: "erro",
          position: "top"
        });
        return;
      }

      // Validação: verificar se há postes selecionados
      if (!postesAdicionados || postesAdicionados.length === 0) {
        toast({
          title: "Erro", 
          description: "Selecione pelo menos um poste para exclusão",
          variant: "erro",
          position: "top"
        });
        return;
      }

      try {
        let arquivos: any[] = [];
        
        // Se há arquivo, formatar conforme estrutura esperada pela API
        if (file && file !== null) {
          arquivos = [{
            nome: file.nome || file.name,
            tamanho: file.tamanho || file.size,
            key: file.key,
            url: file.url
          }];
        }

        const objRequest = {
          cidadeId: Number(municipio),
          posteCodigos: postesAdicionados,
          arquivos: arquivos
        };
        
        console.log("Payload sendo enviado:", objRequest);
        
        const response = await ExcluirPontoService.saveRemovePoints(objRequest);
        
        if (response && response.id) {
          toast({
            description: "Solicitação enviada com sucesso",
            variant: "sucesso",
            position: "top",
            className: "text-white",
          });

          setTimeout(() => {
            handleNavigateByVisualizarExclusao(response.id);
          }, 1500);
        } else {
          throw new Error("Resposta inválida da API");
        }
        
      } catch (error) {
        console.error("Erro ao salvar exclusão:", error);
        toast({
          title: "Erro",
          description: "Não foi possível enviar a solicitação",
          variant: "erro",
          position: "top"
        });
      }
  };

  const handlePesquisar = async () => {
    try {
      const cidadeResponse = await geralService.getCidade(Number(municipio));

      setCidade(cidadeResponse);

      toast({
        description: "Aguarde, carregando pontos...",
        position: "top"
      });

      // const postesResponse = await geralService.getPostes(
      //     cidadeResponse.codigoIbge
      // );

      const lat = Number(cidadeResponse.centroLat);
      const lon = Number(cidadeResponse.centroLon);

      if (!isNaN(lat) && !isNaN(lon)) {
        setCentro([lat, lon]);
      } else {
        console.warn("Centro da cidade inválido:", cidadeResponse);
      }
      //setPostes(postesResponse);

      setPostesAdicionados([]);
    } catch (error) {
      toast({
        description: "Não foi possível carregar os Pontos de Exclusao",
        variant: "erro",
        position: "top",
      });
    }
  };

  const handleNavigateByVisualizarExclusao = useCallback((id: number) => {
    router.push(`/ocupante/excluir-pontos/visualizar-exclusao/${id}`);
  }, []);

  const handleVoltar = useCallback(() => {
    router.push("/ocupante/excluir-pontos");
  }, []);

  const optionYesConfirmDelete = async () => {
    toast({
      description: "Solicitação enviada com sucesso",
      variant: "sucesso",
      position: "top",
      className: "text-white",
    });
    setTimeout(() => {
      handleVoltar();
    }, 1000);
  };

  const optionNoConfirmDelete = async () => {
    toast({
      description: "Solicitação de exclusão cancelada",
      variant: "sucesso",
      position: "top",
    });
    setTimeout(() => {
      handleVoltar();
    }, 1000);
  };

  //Renders
  const RenderHeader = () => (
    <>
      <div className="flex justify-between items-center gap-5 my-3">
        <div className="flex items-end justify-center gap-5">
          <Label className="text-white my-5 text-xl">Município</Label>
          <div className="text-white my-5">
            <select
              className="bg-greenTertiary rounded-md text-white border px-3 py-2"
              onChange={(e) => setMunicipio(e.target.value)}
            >
              <option value="">Selecione o Municipio</option>
              {municipios?.map((municipio) => (
                <option key={municipio.id} value={municipio.id}>
                  {" "}
                  {municipio.descricao}{" "}
                </option>
              ))}
            </select>
          </div>

          <Button
            className="text-greenTertiary bg-white my-5"
            onClick={handlePesquisar}
            variant="default"
            size="lg"
          >
            Pesquisar
          </Button>

          {/* Indicador de postes selecionados */}
          {postesAdicionados.length > 0 && (
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg my-5">
              <span className="font-bold">{postesAdicionados.length}</span> poste{postesAdicionados.length > 1 ? 's' : ''} selecionado{postesAdicionados.length > 1 ? 's' : ''} para exclusão
            </div>
          )}
        </div>

        <div className="flex items-end justify-center gap-5">
          <Button
            className="text-greenTertiary bg-white my-3"
            onClick={handleVoltar}
            variant="default"
            size="lg"
          >
            Voltar
          </Button>
          <Button
            className="text-greenTertiary bg-white my-3"
            onClick={() => {
              // setOpenMap(false);
              setOpenModalFileAttach(true);
            }}
            variant="default"
            size="lg"
          >
            Anexar
          </Button>
          <Button
            className="text-greenTertiary bg-white my-3"
            onClick={() => {
              
              if (postesAdicionados.length === 0) {
              toast({
                description: "Adicione pelo menos 1 poste",
                variant: "erro",
                position: "top",
                className: "text-white",
              });
            } else{
              setOpenModalConfirmRemovePost(true)
            }
              //handleSalvar();
            }}
            variant="default"
            size="lg"
          >
            Salvar
          </Button>
        </div>
      </div>
    </>
  );

  const RenderModalArquivo = () => {
    return openModalFileAttach ? (
      <>
        <AtachFileNotificationModal
          open={openModalFileAttach}
          onOpenChange={() => {
            // setOpenMap(true);
            setOpenModalFileAttach(false);
          }}
          doUpload={false}
          file={file}
          setFile={(file) => {
            //setOpenModalFileAttach(false);
            setFile(file);
          }}
          actionSuccess={(file) => {
            //setOpenModalFileAttach(false);
            setFile(file);
          }}
        />
      </>
    ) : null;
  };

  const RenderModalConfirmarRemocao = () => {
    return openModalConfirmRemovePost ? (
      <>
        <ConfirmRemovePoste
          isOpen={openModalConfirmRemovePost}
          onClose={() => {
            setOpenMap(true);
            setOpenModalConfirmRemovePost(false);
          }}
          onYes={optionYesConfirmDelete}
          onNo={optionNoConfirmDelete}
          loading={false}
          description={`Confirma a solicitação de ${postesAdicionados.length} postes?`}
          ableAutorization={() => {
            handleSalvar2(file, postesAdicionados)
          } }
        />
      </>
    ) : null;
  };

  const RenderMap = () => {
    if (loadingPostes) {
      return <p className="text-white">Carregando mapa...</p>;
    }

    const postesValidos = postes.filter(
      (poste) =>
        !isNaN(Number(poste.lat)) &&
        !isNaN(Number(poste.lon)) &&
        poste.lat !== "" &&
        poste.lon !== ""
    );

    if (postesValidos.length === 0) {
      console.warn("Nenhum poste válido encontrado, não renderizando o mapa.");
      return null;
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
      openMap && (
        <>
          <MapaInterativo
            lista={postes}
            centro={centro}
            adicionados={postesProjeto} // aqui vai a lista de ProjetoPoste, se houver
            onSetPostesAdicionados={(codigoPoste: string) => {
              // Adiciona o poste à lista se não estiver presente
              if (!postesAdicionados.includes(codigoPoste)) {
                setPostesAdicionados([...postesAdicionados, codigoPoste]);
              }
            }}
            onRemovePoste={(codigoPoste: string) => {
              // Remove o poste da lista
              setPostesAdicionados(
                postesAdicionados.filter((p) => p !== codigoPoste)
              );
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

  if (loading) {
      return <LoadingSpinner />;
  }

  const RenderPage = () => (
    <ScrollArea className="w-full h-full bg-greenTertiary px-5 rounded-lg mb-1.5">
      {RenderHeader()}
      {RenderMap()}
      {RenderModalArquivo()}
      {RenderModalConfirmarRemocao()}
    </ScrollArea>
  )

  return (
    <>
      {RenderPage()}
    </>
  );
}
