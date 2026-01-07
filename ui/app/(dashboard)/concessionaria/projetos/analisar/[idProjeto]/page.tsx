"use client";
import BreadCrumb from "@/components/breadcrumb";
import { Mapa } from "@/components/map/map-component";
import { LoadingSpinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import useAsync from "@/hooks/useAsync";
import geralService from "@/services/geral";
import { CidadeResponseType, PosteResponseType } from "@/services/geral/types";
import projetoService, {
  ProjetoResponseType,
} from "@/services/projeto-service";
import { Poste, ProjetoPoste } from "@/types";
import { useCallback, useEffect, useState } from "react";
import {
  ProjetoStatusAnalise,
  ProjetoStatusAprovado,
  ProjetoStatusPausado,
  ProjetoStatusReprovado,
} from "@/services/projeto-service/types";
import ModalSalvar from "./modal";
import ModalArquivos from "./arquivos";
import { Icons } from "@/components/icons";
import MapaInterativoAnaliseprojeto from "@/components/map/mapa-analise-projeto-concessionaria/map-new";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BasicResponseType } from "@/services/http";
import IconGfonts from "@/components/icon-gfonts/icon";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { idProjeto: number } }) {
  const { toast } = useToast();
  const router = useRouter();
  
  const { idProjeto } = params;
  const breadcrumbItems = [
    { title: "Projetos", link: "/concessionaria/projetos" },
    {
      title: "Análise projeto " + idProjeto,
      link: "/concessionaria/projetos/analise/" + idProjeto,
    },
  ];

  const [projeto, setProjeto] = useState<ProjetoResponseType>();
  const [cidade, setCidade] = useState<CidadeResponseType>();
  const [postes, setPostes] = useState<PosteResponseType[]>([]); 
  const [postesProjeto, setPostesProjeto] = useState<ProjetoPoste[]>([]);;
  const [salvarStatus, setSalvarStatus] = useState<string>("");
  const [isMostrandoArquivos, setIsMostrandoArquivos] = useState<boolean>(false);
  const [municipios, setMunicipios] = useState<BasicResponseType[]>([]);
  const [cidadePequisa, setCidadePequisa] = useState<any>();
  const [idPesquisado , setIdPesquisado] = useState<any>("");
  const [disponiveis, setDisponiveis] = useState<number>(0)
  const [poucasVagas, setPoucasVagas] = useState<number>(0)
  const [indisponiveis, setIndisponiveis] = useState<number>(0)
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)
  const [canPauseProject, setCanPauseProject] = useState<boolean>(false)
  

  const editavel = projeto && projeto.projeto.status === ProjetoStatusAnalise;

  const { loading: loadingCidades, call: pesquisarCidades } =
    useAsync(async () => {
      try {
        const response = await geralService.getCidades();
        setMunicipios(response);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as Cidades",
          variant: "erro",
          position: "top"
        });
      }
    }, []);

  const { loading: loading, call: pesquisar } = useAsync(async () => {
    try {
      // toast({
      //   description: "Download Feito com Sucesso!",
      // });

      const projetoResponse = await projetoService.getProjetoConcessionaria(idProjeto);
      setCanPauseProject(projetoResponse.canPauseProject)
      console.log(projetoResponse)
      if(projetoResponse?.postes === null){
        setPostesProjeto([])
      } else {
        // if (projetoResponse && projetoResponse.postes.length > 0) {
        //   const postesValidos = projetoResponse.postes.filter(
        //       (poste) =>
        //         !isNaN(Number(poste.lat)) &&
        //         !isNaN(Number(poste.lon)) &&
        //         poste.lat !== "" &&
        //         poste.lon !== ""
        //       );
                    
        //       //setPostesProjeto(postesValidos as any);
        //       setPostes(postesValidos);
        // }
        setProjeto(projetoResponse);
        setCidadePequisa(projetoResponse.projeto.cidadeId)
        setPostesProjeto(projetoResponse?.postes);
        setPostes(
          projetoResponse?.postes.map((obj) => obj.poste as PosteResponseType) ??
            []
        );

        const cidadeResponse = await geralService.getCidade(
          projetoResponse.projeto.cidadeId
        );
        setCidade(cidadeResponse);
        //console.log(cidadeResponse)
        setLatitude( Number(cidadeResponse.centroLat) )
        setLongitude( Number(cidadeResponse.centroLon) )
      }
      
    } catch (error) {
      console.log(error)
      toast({
        description: "Erro",
        variant: "erro",
        position: "top"
      });
    }
  }, []);

  //Nao ta funcionando
  // const { loading: loadingdownloadKmz , call: downloadKmz } = useAsync(async () => {
  //   try {
  //     toast({
  //       description: "DownloadKmz Feito com Sucesso!",
  //     });

  //     const projetoResponse = await projetoService.exportarPontos(idProjeto, "concessionaria")
  //     console.log(projetoResponse)
  //   } catch (error) {
  //     console.log(error)
  //     toast({
  //       description: "Erro",
  //       variant: "erro",
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   downloadKmz();
  // }, []);
  
  const { loading: loadingCidade , call: pesquisarCidade } =
  useAsync(async () => {
    try {
      if(cidadePequisa !== undefined){
        const response = await geralService.getCidade(cidadePequisa);
        setLatitude( Number(response.centroLat) )
        setLongitude( Number(response.centroLon) )
      }
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a Cidade",
        variant: "erro",
        position: "top"
      });
    }
  }, [cidadePequisa]);

  function pesquisarPeloId(){
        const found = postes.find( (element) => element.codigo === idPesquisado )
        if(found !== undefined){
          // Atualiza a latitude e Logintude para centralizar o Mapa
          setLatitude(Number(found.lat))
          setLongitude(Number(found.lon))
        }
  }

  function calcularQuantidadePostesPeloStatus() {
    let countD = 0
    let countN = 0
    let countP = 0
    let postes = projeto?.postes
    //console.log(postes)
    if (postes) {
      for(let i = 0; i < postes.length ; i++){
        if(postes[i].poste?.situacao === "D") ++countD 
        if(postes[i].poste?.situacao === "N") ++countN
        if(postes[i].poste?.situacao === "P") ++countP
      }
    }
    
    setDisponiveis(countD)
    setIndisponiveis(countN)
    setPoucasVagas(countP)
  }

  useEffect(() => {
    calcularQuantidadePostesPeloStatus();
   }, [projeto]);

  useEffect(() => {
    pesquisarPeloId();
   }, [idPesquisado]);

 useEffect(() => {
  pesquisarCidade();
 }, [cidadePequisa, setCidadePequisa]);

  // useEffect(() => {
  //   pesquisar();
  // }, [latitude, longitude]);

  useEffect(() => {
    pesquisar();
  }, []);

  useEffect(() => {
    pesquisarCidades();
  }, []);


  const pausarProjeto = async () => {
    setSalvarStatus(ProjetoStatusPausado);
  };

  const reprovarProjeto = async () => {
    setSalvarStatus(ProjetoStatusReprovado);
  };

  const aprovarProjeto = async () => {
    setSalvarStatus(ProjetoStatusAprovado);
  };

  const handleVoltar = useCallback(() => {
    router.push("/concessionaria/projetos");
  }, []);

  const renderModalSalvar = () => {
    return !!salvarStatus ? (
      <ModalSalvar
        onClose={() => setSalvarStatus("")}
        status={salvarStatus}
        projeto={projeto?.projeto}
        mostrarMotivo={salvarStatus !== ProjetoStatusAprovado}
        idProjeto={idProjeto}
      />
    ) : null;
  };

  const renderModalArquivos = () => {
    return isMostrandoArquivos ? (
      <ModalArquivos
        onClose={() => setIsMostrandoArquivos(false)}
        projeto={projeto?.projeto}
      />
    ) : null;
  };


  const exportarPontos = async () => {
    try {
      window.open(
        `/api/backend?uri=concessionaria/projeto/${projeto?.projeto?.id}/exportar-pontos`,
        "_blank"
      );
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar os pontos",
        variant: "erro",
        position: "top"
      });
    }
  };

  const renderFiltroMunicipio = () => (
    <div>
      <Label className=" text-xl" >
        Cidade <span className="text-red-500" >*</span>
      </Label>
      <div className="my-1" >
        <select className=" rounded-md border px-3 py-2" value={cidadePequisa} onChange={ e => setCidadePequisa(e.target.value)} >
          <option className="hidden" value="">Selecione a Cidade</option>
            {municipios?.map(municipio => (
            <option key={municipio.id} value={municipio.id}> {municipio.descricao} </option>
          ))}                
        </select>
      </div>
    </div>
  );

  const renderFiltroBuscarPorID = () => (
    <div>
      <Label className=" text-xl" >
        Buscar por ID
      </Label>
      <div className="my-1" >
        <input type="text" value={idPesquisado} className="rounded-md border px-3 py-2" onChange={ e => setIdPesquisado(e.target.value)} />
      </div>
    </div>
  );

  const renderQuantitativoStatus = () => (
    <div className="flex gap-4" >
      <div className="text-center" >
        <div className="bg-green-700 py-1 px-2 rounded-md" > <span className="text-white font-bold" >DISPONIVEIS</span>  </div>
        <span className="text-green-700 font-bold text-center" > {disponiveis} </span>
      </div>
      <div className="text-center" >
        <div className="bg-orange-400 py-1 px-2 rounded-md" > <span className="text-white font-bold" >POUCAS VAGAS</span>  </div>
        <span className="text-orange-400 font-bold text-center" > {poucasVagas} </span>
      </div>
      <div className="text-center" >
        <div className="bg-red-700 py-1 px-2 rounded-md" > <span className="text-white font-bold" >INDISPONIVEIS</span>  </div>
        <span className="text-red-700 font-bold text-center" > {indisponiveis} </span>
      </div>
    </div>
  );

  const renderBotoesDownload = () => (
    <div className="flex flex-col gap-4" >
      <Button
        title="Baixar KMZ"
        onClick={() => exportarPontos()}
        className="bg-blue-500"
      >
        <IconGfonts id="save" />
        <span className="ml-2" >Baixar KMZ</span> 
      </Button>

      <Button
        title="Baixar Excel"
        onClick={() => exportarPontos()}
        className="bg-gray-400"
      >
        <IconGfonts id="article" />
        <span className="ml-2" >Baixar Excel</span>
      </Button>
    </div>
  )

  // const renderBotaoPesquisar = () => (
  //   <button
  //     className="bg-blue-700 text-white py-1 px-2 rounded-md"
  //     onClick={() => {
  //       const found = postes.find( (element) => element.codigo === idPesquisado )
  //       if(found === undefined){
  //         console.log("Erro")
  //       }else{
  //         console.log(found)
  //         // Atualiza a latitude e Logintude para centralizar o Mapa
  //         setLatitude(Number(found.lat))
  //         setLongitude(Number(found.lon))
  //         console.log([latitude, longitude])
  //       }
        
  //     }}
  //   >Pesquisar</button>
  // );

  const renderHeader = () => (
    <div className="flex justify-between items-center" >
      {renderFiltroMunicipio()}
      {renderFiltroBuscarPorID()}
      {/* {renderBotaoPesquisar() } */}
      {renderQuantitativoStatus()}
      {renderBotoesDownload()}
    </div>
  )

  const showMap = !salvarStatus && !isMostrandoArquivos;
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <div className="flex items-center space-x-4">
            <Heading
              title={projeto?.projeto?.descricao ?? ""}
              description={"Análise do Projeto - " + projeto?.projeto.id}
            />
            <div className="flex grow justify-end space-x-4">
              <Button
                  title="Volar para tela Projetos"
                  onClick={() => handleVoltar()}
              >
                Voltar
              </Button>
              <Button
                  title="Download pontos"
                  onClick={() => exportarPontos()}
              >
                <Icons.download />
              </Button>
              <Button
                title="Anexos do Projeto"
                onClick={() => setIsMostrandoArquivos(true)}
              >
                Anexos do Projeto
              </Button>
              <Button
                //disabled={!editavel} //liberado teste
                variant="secondary"
                title="Pausar projeto"
                onClick={() => pausarProjeto()}
                disabled={!canPauseProject}
              >
                Pausar Projeto
              </Button>
              <Button
                //disabled={!editavel} //liberado teste
                variant="destructive"
                title="Reprovar"
                onClick={() => reprovarProjeto()}
              >
                Reprovar Projeto
              </Button>
              <Button
                //disabled={!editavel} //liberado teste
                title="Aprovar"
                onClick={() => aprovarProjeto()}
              >
                Aprovar Projeto
              </Button>
            </div>
          </div>
          <Separator />
          {/* {renderHeader()} */}
          <div className="w-300 h-250">
            {showMap && (
              <MapaInterativoAnaliseprojeto
                lista={postes as unknown as Poste[]}
                //  centro={[
                //    Number(cidade?.centroLat ?? "0"),
                //    Number(cidade?.centroLon ?? "0"),
                //  ]}
                 centro={[
                   latitude,
                   longitude 
                 ]}
                adicionados={postesProjeto}
                editavel={false}
              />
            )}
          </div>
        </div>
        {renderModalSalvar()}
        {renderModalArquivos()}
      </ScrollArea>
      
    </>
    
  );
}
