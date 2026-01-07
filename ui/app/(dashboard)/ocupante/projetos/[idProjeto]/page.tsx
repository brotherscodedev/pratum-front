"use client";
import { Mapa } from "@/components/map/map-component";
import { LoadingSpinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import useAsync from "@/hooks/useAsync";
import geralService from "@/services/geral";
import { CidadeResponseType, PosteResponseType } from "@/services/geral/types";
import projetoService, {
  ProjetoResponseType,
} from "@/services/projeto-service";
import { Poste, ProjetoPoste } from "@/types";
import { useEffect, useState } from "react";
import ModalArquivos from "./arquivos";
import { FileUploaded } from "@/components/crud/upload";
import ModalProtocolo from "./protocolo";
import { BasicResponseType } from "@/services/http";
import { Label } from "@/components/ui/label";
import IconGfonts from "@/components/icon-gfonts/icon";

export default function Page({ params }: { params: { idProjeto: number } }) {
  
  // Variaveis
  const DELTA_AUMENTO_REDUCAO = 0.01
  const TAMANHO_INICIAL_QUADRADO = 0.03
  const TAMANHO_MAXIMO_QUADRADO = 0.1
  const TAMANHO_MINIMO_QUADRADO = 0.03
  const { idProjeto } = params; 
  const { toast } = useToast();
  const [projeto, setProjeto] = useState<ProjetoResponseType>();
  const [cidade, setCidade] = useState<CidadeResponseType>();
  const [postes, setPostes] = useState<PosteResponseType[]>([]);
  const [postesProjeto, setPostesProjeto] = useState<ProjetoPoste[]>([]);
  const [isCriandoArquivos, setIsCriandoArquivos] = useState<boolean>(false);
  const [isSalvando, setIsSalvando] = useState<boolean>(false);
  // const [salvarStatus, setSalvarStatus] = useState<string>("");
  // const [isMostrandoArquivos, setIsMostrandoArquivos] = useState<boolean>(false);
  const [municipios, setMunicipios] = useState<BasicResponseType[]>([]);
  const [cidadePequisa, setCidadePequisa] = useState<any>();
  const [idPesquisado , setIdPesquisado] = useState<any>("");
  const [disponiveis, setDisponiveis] = useState<number>(0)
  const [poucasVagas, setPoucasVagas] = useState<number>(0)
  const [indisponiveis, setIndisponiveis] = useState<number>(0)
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)
  const [openSquad, setOpenSquad] = useState<boolean>(false)
  const [savePostes, setSavePostes] = useState<boolean>(false)
  const [removePostes, setRemovePostes] = useState<boolean>(false)
  const [loadingPostes, setLoadingPostes] = useState(true);
  const [tamanhoQuadrado, setTamanhoQuadrado] = useState(TAMANHO_INICIAL_QUADRADO)
  const [bloquearCentralizacaoMapa, setBloquearCentralizacaoMapa] = useState(false)

  //const editavel = projeto && projeto.projeto.status === ProjetoStatusAnalise;

  // Funcoes
  // o mapa inicia centralizado nas localizacao do centro de Ponta Grossa
  // useEffect(() => {
  //   setLatitude(-25.09)
  //   setLongitude(-50.15)
  // }, [])

  const { loading: loadingCidades, call: pesquisarCidades } =
    useAsync(async () => {
      try {
        const response = await geralService.getCidades();
        setMunicipios(response);

      } catch (error) {
        toast({
          description: "Não foi possível carregar as Cidades",
          variant: "erro",
          position: "top"
        });
      }
    }, []);

  useEffect(() => {
    pesquisarCidades();
  }, []);

  // const { loading: loadingPesquisar, call: pesquisarPelaCidade } = useAsync(async () => {
  //   try {
  //     const projetoResponse = await projetoService.getProjetoConcessionaria(idProjeto);
  //     console.log(projetoResponse)
  //     setProjeto(projetoResponse);
  //     setPostesProjeto(projetoResponse?.postes);
  //     setPostes(
  //       projetoResponse?.postes.map((obj) => obj.poste as PosteResponseType) ??
  //         []
  //     );

  //     const cidadeResponse = await geralService.getCidade(
  //       projetoResponse.projeto.cidadeId
  //     );
  //     setCidade(cidadeResponse);
  //     console.log(cidadeResponse)
  //     setLatitude( Number(cidadeResponse.centroLat) )
  //     setLongitude( Number(cidadeResponse.centroLon) )
  //   } catch (error) {
  //     console.log(error)
  //     toast({
  //       description: "Erro",
  //       variant: "erro",
  //       position: "top"
  //     });
  //   }
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
      console.log(error)
      toast({
        description: "Não foi possível carregar a Cidade",
        variant: "erro",
        position: "top"
      });
    }
  }, []); // cidadePequisa

  useEffect(() => {
    pesquisarCidade();
  }, [cidadePequisa]);

  const handlePesquisar = async () => {
     try {
      if(cidadePequisa !== undefined){
        //console.log(cidadePequisa)
        const response = await geralService.getCidade(cidadePequisa);
        setLatitude( Number(response.centroLat) )
        setLongitude( Number(response.centroLon) )
      }
    } catch (error) {
      toast({
        description: "Não foi possível carregar a Cidade",
        variant: "erro",
        position: "top"
      });
    }
  };

  function pesquisarPeloId(){
    const found = postes.find( (element) => element.codigo === idPesquisado )
    if(found === undefined){
      console.log("Erro")
    }else{
      // Atualiza a latitude e Logintude para centralizar o Mapa
      setLatitude(Number(found.lat))
      setLongitude(Number(found.lon))
    }
  }

  function calcularQuantidadePostesPeloStatus() {
    let countD = 0
    let countN = 0
    let countP = 0
    //let postes = projeto?.postes
    //console.log(postes)
    for(let i = 0; i < postes?.length ; i++){
      if(postes[i].situacao === "D") ++countD 
      if(postes[i].situacao === "N") ++countN
      if(postes[i].situacao === "P") ++countP
    }
    //console.log(countD, countN, countP)
    setDisponiveis(countD)
    setIndisponiveis(countN)
    setPoucasVagas(countP)
  }

  const { loading: loading, call: pesquisar } = useAsync(async () => {
    try {
      const projetoResponse = await projetoService.getProjeto(idProjeto);
      //console.log(projetoResponse)
      setCidadePequisa(projetoResponse.projeto.cidadeId)
    
      setProjeto(projetoResponse);
      setPostesProjeto(projetoResponse?.postes || []);

      const cidadeResponse = await geralService.getCidade(
        projetoResponse.projeto.cidadeId
      );
      setCidade(cidadeResponse);

      toast({
        description: "Aguarde, carregando pontos...",
        position: "top"
      });

      const postesResponse = await geralService.getPostes(
        cidadeResponse.codigoIbge
      );
      //console.log(postesResponse)
      
      if(postesResponse === null){
        setPostes([]);
      }

      if (postesResponse && postesResponse.length > 0) {

        const postesValidos = postesResponse.filter(
          (poste) =>
            !isNaN(Number(poste.lat)) &&
            !isNaN(Number(poste.lon)) &&
            poste.lat !== "" &&
            poste.lon !== ""
        );
    
        setPostes(postesValidos as any);
        //setPostes(postesResponse);
      }
      
    } catch (error) {
      toast({
        description: "Não foi possível carregar o projeto",
        variant: "erro",
        position: "top",
      });
    } finally{
      setLoadingPostes(false)
    }
  }, []);

  useEffect(() => {
    pesquisar()
  }, []);

  useEffect(() => {
    pesquisarPeloId();
  }, [idPesquisado, setCidadePequisa]); //

 useEffect(() => {
  handlePesquisar()
 }, [cidadePequisa]); // cidadePequisa

  

  useEffect(() => {
    calcularQuantidadePostesPeloStatus();
  }, [postes]);

  const removePoste = async (poste: Poste) => {
    try {
      await projetoService.removePoste(idProjeto, poste.codigo);
      const a = postesProjeto.filter((pp) => pp.codigoPoste !== poste.codigo);
      setPostesProjeto(a);
      // centraliza o poste removido na latitude e longitude do poste
      centralizarLatitudeLongitude(poste.codigo)
      toast({
        description: "Ponto removido com sucesso",
        position: "top",
        variant: "sucesso",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: "Não foi possível remover o ponto",
        variant: "erro",
        position: "top",
      });
    }
  };

  function centralizarLatitudeLongitude(codigoPoste: string){
    let auxArray = postes
    let res = [] 
    res = auxArray.filter( (poste) => poste.codigo === codigoPoste )
    //console.log(res)
    if(res.length !== 0 ){
       setLatitude(Number(res[0].lat))
       setLongitude(Number(res[0].lon))
    }
  }

  const changePoste = async (codigoPoste: string, pp: ProjetoPoste) => {
    try {
      
      pp.codigoPoste = codigoPoste;
      const novo = !pp.id;
      const ppNovo = await projetoService.savePoste(idProjeto, pp);
      //console.log(ppNovo)
      if (novo) {
        const a = Array.from(postesProjeto);
        a.push(ppNovo);
        setPostesProjeto(a);
      } else {
        const a = postesProjeto.map((ppAtual) =>
          ppAtual.codigoPoste === pp.codigoPoste ? ppNovo : ppAtual
        );
        setPostesProjeto(a);
      }

      // Essa funcão centralizara o poste adicionado ou removido conforme as au suas cordernadas de latitude e logitude
      centralizarLatitudeLongitude(codigoPoste)

      toast({
        description: "Ponto alterado com sucesso",
        position: "top",
        variant: "sucesso",
      });
      
      
    } catch (error) {
      console.log(error);
      toast({
        description: "Não foi possível alterar o ponto",
        variant: "erro",
        position: "top",
      });
    }
  };

  const salvarProjeto = async () => {
    if (!projeto?.projeto?.arquivos?.length) {
      toast({
        title: "Alerta",
        description: "Obrigatório a inclusão dos arquivos em Formato PDF",
        variant: "advertencia",
        position: "top",
      });
      return;
    }

    setIsSalvando(true);
  };

  const adicionarArquivo = async (arquivo: FileUploaded) => {
    try {
      const arquivoResponse = await projetoService.addArquivo(
        projeto?.projeto?.id || 0,
        arquivo
      );
      projeto?.projeto.arquivos.push(arquivoResponse);
      setProjeto(projeto);
      toast({
        description: "Arquivo adicionado com sucesso",
        variant: "sucesso",
        position: "top",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: "Não foi possível adicionar o arquivo",
        variant: "erro",
        position: "top",
      });
    }
  };

  const removerArquivo = async (id: number) => {
    try {
      await projetoService.removeArquivo(projeto?.projeto?.id || 0, id);
      const index = projeto?.projeto?.arquivos.findIndex(
        (arquivo) => arquivo.id === id
      );
      projeto?.projeto?.arquivos.splice(index || -1, 1);
      setProjeto(projeto);
      toast({
        description: "Arquivo removido com sucesso",
        variant: "sucesso",
        position: "top",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: "Não foi possível remover o arquivo",
        variant: "erro",
        position: "top",
      });
    }
  };

  function aumentarQuadrado(){
    if( TAMANHO_MAXIMO_QUADRADO <= tamanhoQuadrado){
      toast({
        title: "Alerta",
        description: "Selecão ja esta no seu limite maximo",
        variant: "advertencia",
        position: "top",
      });
    } else{
      setTamanhoQuadrado( tamanhoQuadrado + DELTA_AUMENTO_REDUCAO)
    }
  }

  function diminuirQuadrado(){
    if( tamanhoQuadrado <= TAMANHO_MINIMO_QUADRADO){
            toast({
                title: "Alerta",
                description: "Selecão ja esta no seu tamanho minimo",
                variant: "advertencia",
                position: "top",
            });
    } else {
      setTamanhoQuadrado( tamanhoQuadrado - DELTA_AUMENTO_REDUCAO)
    }
  }

  // Renders 
  const renderFiltroMunicipio = () => (
    <div>
      <Label className="text-gray-400 text-xl" >
          Cidade <span className="text-red-500" >*</span>
        </Label> 
      <div className="my-1" >
         
        {/* <span className="block text-gray-400 text-xl" >Cidade <span className="text-red-500" >*</span> </span> */}
        <select className=" rounded-md border px-3 py-2" value={cidadePequisa} onChange={ (e) => {  
          setCidadePequisa(e.target.value) 
          // setTimeout(() => {
          //   handlePesquisar
          // },500)
          
        }
           } >
          <option className="hidden" value={undefined} >Selecione a Cidade</option>
            {municipios?.map(municipio => (
            <option key={municipio.id} value={municipio.id}> {municipio.descricao} </option>
          ))}                
        </select>
      </div>
      {/* <Button
            className="text-greenTertiary bg-white my-5"
            onClick={ handlePesquisar }
            variant="default"
            size="lg"
          >
            Pesquisar
      </Button> */}
    </div>
  );

  const renderFiltroBuscarPorID = () => (
    <div>
      <Label className="text-gray-400 text-xl" >
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

  

  const renderAbrirPoligono = () => (
   <div className="flex flex-col gap-4" >
      
      <div className="flex gap-2" >

        {openSquad && (
        <>
          <Button title="Diminuir o Tamanho da Selecão" onClick={() =>  {diminuirQuadrado()} } >
            <span className="ml-1" >-</span>
          </Button>
        </>)
      }
        
        

        <Button className={!openSquad ? "w-full" : "bg-red-700"} title={!openSquad ? "Selecionar Postes" : "Remover Seleção"} onClick={() => {
          if(!openSquad){
            toast({
                title: "Alerta",
                description: "Clique no mapa para selecionar a area dos postes que deseja selecionar!",
                variant: "advertencia",
                position: "top",
            });
          }
          setOpenSquad(!openSquad)
        } }>
        {!openSquad && <> <IconGfonts id="select_all" /> <span className="ml-1" >Selecionar Postes</span></>  }
        {openSquad && <> <IconGfonts id="delete" /> <span className="ml-1" >Remover Seleção de Postes</span></>  }
      </Button>

      
      {openSquad && (
        <>
          <Button title="Aumentar Tamanho da Selecão" onClick={() =>  aumentarQuadrado()} >
              <span className="ml-1" >+</span>
          </Button>
        </>)
      }
      
      </div>
      <div className="flex gap-2" >
        <Button title="Salvar Multiplos Postes" onClick={() =>  {
            if(openSquad){
              setSavePostes(true)
            } else{
              toast({
                title: "Alerta",
                description: "Selecione os postes antes de Salvar Multiplos postes",
                variant: "advertencia",
                position: "top",
              });
            }
          }
          } 
        >
          
          <IconGfonts id="save" />
          <span className="ml-1" >Salvar Postes</span>
        </Button>
        <Button className="bg-red-700" title="Remover Multiplos Postes" onClick={() => {

          if(openSquad){
              setRemovePostes(true)
            } else{
              toast({
                title: "Alerta",
                description: "Selecione os postes antes de Remover Multiplos postes",
                variant: "advertencia",
                position: "top",
              });
            }
          }
          
          //setRemovePostes(true)
          } 
        >
          <IconGfonts id="delete" />
          <span className="ml-1" >Remover Postes</span> 
        </Button>
      </div>
   </div>
  )

  const renderBotoesDownload = () => (
    <div className="flex flex-col gap-4" >
      <Button
        className="secondary"
        title="Arquivos do Projeto"
        onClick={() => setIsCriandoArquivos(true)}
      >
        <IconGfonts id="description" />
        <span className="ml-1" > Arquivos do Projeto </span>
      </Button>
      <Button className="" title="Salvar Projeto" onClick={() => salvarProjeto()}>
        <IconGfonts id="save" />
        <span className="ml-1" > Salvar Projeto </span> 
      </Button>
    </div>
  )

  const renderModalArquivos = () => {
    return isCriandoArquivos ? (
      <ModalArquivos
        onArquivoAdded={(arquivo) => adicionarArquivo(arquivo)}
        onArquivoRemoved={(id) => {
          removerArquivo(id);
        }}
        onClose={() => setIsCriandoArquivos(false)}
        projeto={projeto?.projeto}
      />
    ) : null;
  };

  const renderModalSalvar = () => {
    return isSalvando ? (
      <ModalProtocolo
        onClose={() => setIsSalvando(false)}
        projeto={projeto?.projeto}
      />
    ) : null;
  };

  const renderCaixaQuantidadePostesSelecionado = () => {
    return (
      <div className="bg-white px-2 py-3 rounded-md m-2 absolute top-0 right-0 flex items-center justify-center gap-2" >
          <span >Postes</span> 
          <div className=" bg-indigo-200 px-2 py-1 rounded-md " > <span className="text-indigo-700" > {postesProjeto.length} </span>  </div>
      </div>
    )
  }

  const renderMap = () => {
    
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
      return <h2 className="text-2xl" >Mapa não contem postes!</h2>;
    }

    if (
      !Array.isArray([latitude, longitude]) ||
      [latitude, longitude].length !== 2 ||
      [latitude, longitude].some((value) => isNaN(value))
    ) {
      console.warn(
        "Centro inválido detectado, não renderizando o mapa:",
        [latitude, longitude]
      );
      return <h2 className="text-2xl" >Erro  na renderizacão do Mapa</h2>;
    }

    return  showMap ? (
             <Mapa
               lista={postes as unknown as Poste[]}
               centro={[
                    latitude,
                    longitude 
                    ]}
               adicionados={postesProjeto}
               onRemove={removePoste}
               onChange={changePoste}
               latitude={latitude}
               longitude={longitude}
               todosPostesMapa={postes}
               openSquad={openSquad}
               savePostes={savePostes}
               removePostes={removePostes}
               setSavePostes={() => setSavePostes}
               setRemovePostes={ () => setRemovePostes}
               tamanhoQuadrado={tamanhoQuadrado}
             />
              ) : <LoadingSpinner />
        
  }

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-5" >
      {renderFiltroMunicipio()}
      {renderFiltroBuscarPorID()}
      {renderQuantitativoStatus()}
      {/* {renderAbrirPoligono()} */}
      {renderBotoesDownload()}
    </div>
  )
  
  const showMap = !loading && !isSalvando && !isCriandoArquivos;
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollArea className="h-full">
      {renderHeader()}
      <div className="relative w-300 h-300">
        {renderMap()}
        {renderCaixaQuantidadePostesSelecionado()}
      </div>
      {renderModalArquivos()} 
      {renderModalSalvar()}
    </ScrollArea>
  );
}
