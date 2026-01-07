import { LayersControl, MapContainer, Marker, Popup, Rectangle, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./map.module.css";
import Mark from "./mark";
import { Poste, ProjetoPoste } from "@/types";
import { Fragment, useEffect, useRef, useState } from "react";
import  {listPostMock}   from "@/constants/data";
import { PosteResponseType } from "@/services/geral/types";
import IconGfonts from "../icon-gfonts/icon";
import { useToast } from "../ui/use-toast";
import { LoadingSpinner } from "../spinner";

const DELTA_QUADRADO = 0.1

const MAX_POINTS = 1000;
interface MapProps {
  lista: Poste[];
  centro: [number, number];
  adicionados: ProjetoPoste[];
  setPostes ?: () => void
  editavel?: boolean;
  onRemove?: (poste: Poste) => Promise<void>;
  onChange?: (codigoPoste:string, poste: ProjetoPoste) => Promise<void>;
  onSetPostesAdicionados ?: () => void
  postesAdicionados ?: string []
  latitude ?: number;
  longitude ?: number;
  todosPostesMapa ?: PosteResponseType []
  openSquad ?: boolean
  savePostes ?: boolean
  removePostes ?: boolean
  setSavePostes ?:  () => void 
  setRemovePostes?: () => void
  tamanhoQuadrado?: number
}

interface Bounds {
  _southWest: {
    lat: number;
    lng: number;
  };
  _northEast: {
    lat: number;
    lng: number;
  };
}



const filtrarLista = (
  lista: Poste[],
  adicionados: Map<string, ProjetoPoste>,
  bounds?: Bounds
): Poste[] => {
  if (!bounds) return [];

  const visiveis = lista.filter((p) => {
    const lat = Number(p.lat);
    const lon = Number(p.lon);
    return (
      lat >= bounds._southWest.lat &&
      lat <= bounds._northEast.lat &&
      lon >= bounds._southWest.lng &&
      lon <= bounds._northEast.lng
    );
  });

  if (visiveis.length <= MAX_POINTS) return visiveis;

  const fixos = visiveis.filter((p) => adicionados.has(p.codigo));
  const restantes = visiveis.filter((p) => !adicionados.has(p.codigo));

  // Ordenação estável para evitar alteração visual constante
  const ordenados = restantes
    .sort((a, b) => a.codigo.localeCompare(b.codigo))
    .slice(0, MAX_POINTS - fixos.length);

  return [...fixos, ...ordenados];
};

const Mapa = ({
  lista,
  centro,
  adicionados,
  setPostes,
  onRemove,
  onChange,
  editavel = true,
  onSetPostesAdicionados,
  postesAdicionados,
  latitude,
  longitude,
  todosPostesMapa,
  openSquad, 
  savePostes, 
  removePostes,
  setSavePostes,
  setRemovePostes,
  tamanhoQuadrado
}: MapProps) => {

  // Variaveis e Constantes
  const [map, setMap] = useState<L.Map | null>(null);
  const { BaseLayer, Overlay } = LayersControl;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const mapAdicionados = new Map(
    adicionados.map((obj) => [obj.codigoPoste, obj])
  );
  const [latitudeQuadrado , setLatitudeQuadrado ] = useState(0)
  const [longitudeQuadrado , setLongitudeQuadrado ] = useState(0)
const [bloquearCentralizacaoMapa, setBloquearCentralizacaoMapa] = useState(false);

  const [marks, setMarks] = useState<Poste[]>(
   
  );

  useEffect(() => {
  if (map && lista.length > 0) {
    const leafletBounds = map.getBounds();
    const bounds: Bounds = {
      _southWest: {
        lat: leafletBounds.getSouth(),
        lng: leafletBounds.getWest()
      },
      _northEast: {
        lat: leafletBounds.getNorth(),
        lng: leafletBounds.getEast()
      }
    };
    onBoundsChange(bounds);
  }
}, [map, lista]);

  interface MapEventsProps {
  onBoundsChange: (bounds: Bounds) => void;
}
function MapEnvents({ onBoundsChange }: MapEventsProps) {
  const map = useMapEvents({
    moveend: (e) => {
      onBoundsChange(e.target.getBounds());
    },
    zoomend: (e) => {
      onBoundsChange(e.target.getBounds());
    },
    dragstart: () => setBloquearCentralizacaoMapa(true),
  zoomstart: () => setBloquearCentralizacaoMapa(true),
    // dragend: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // zoomend: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // mousedown: (e) => {
    //   onBoundsChange(e.target.getBounds());
    //   console.log('mousedown')
    // },
    // overlayadd: (e) => {
    //   onBoundsChange(e.target.getBounds());
    //   console.log('overlayadd')
    // },
    // click: (e) => {
    //   onBoundsChange(e.target.getBounds());
    //   console.log('click')
    // },
    // mouseover: (e) => {
    //   onBoundsChange(e.target.getBounds());
    //   console.log('mouseover')
    // },
    // move: (e) => {
    //   onBoundsChange(e.target.getBounds());
    //   console.log('move')
    // },
    // dragstart: (e) => {
    //   onBoundsChange(e.target.getBounds());
    //   console.log('dragstart')
    // },
    // overlayremove: (e) => {
    //   onBoundsChange(e.target.getBounds());
    //   console.log('overlayremove')
    // },
  });
  return null;
}

const onBoundsChange = (bounds: Bounds) => {
  const novos = filtrarLista(lista, mapAdicionados, bounds);

  // Evita setMarks desnecessário comparando códigos
const codigosAntigos = (marks ?? []).map(p => p.codigo).sort().join(",");
const codigosNovos = novos.map(p => p.codigo).sort().join(",");


if (codigosAntigos !== codigosNovos) {
  setMarks(novos);
}
};
  const [posteProjetoLocal, setPosteProjetoLocal] = useState<ProjetoPoste>({
     id: 0,
     codigoPoste: "",
     equipamento:  false,
     esforcoMecanico:  false,
     subteranea:  false,
   });

function AtualizarCentro({
  centro,
  centralizar = false, // nova prop
}: {
  centro: [number, number];
  centralizar?: boolean;
}) {
  const map = useMap();
  const previousCentroRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (!map || !centralizar) return;

    const [lat, lng] = centro;
    const [prevLat, prevLng] = previousCentroRef.current || [null, null];

    const current = map.getCenter();
    const isSameCentro =
      prevLat === lat &&
      prevLng === lng &&
      Math.abs(current.lat - lat) < 0.0001 &&
      Math.abs(current.lng - lng) < 0.0001;

    if (!isSameCentro) {
      previousCentroRef.current = [lat, lng];
      map.setView([lat, lng], map.getZoom());
    }
  }, [map, centralizar]); // reexecuta só se o centro *forçado* mudar

  return null;
}

  function adicionarMultiplosPostes(){
    toast({
      title: "Carregando",
      description: "Aguarde a conclusão das multiplas adicões! ",
      position: "top",
      //variant: "advertencia",
    });
      setLoading(true)
      let postesAdicionados : PosteResponseType[] = []
      todosPostesMapa?.forEach((poste) => {
      if(  longitudeQuadrado <= Number(poste.lon) &&  Number(poste.lon) <= longitudeQuadrado + (tamanhoQuadrado || 0) &&   latitudeQuadrado <= Number(poste.lat)  &&  Number(poste.lat) < latitudeQuadrado + (tamanhoQuadrado || 0) && poste.situacao === "D") {
        postesAdicionados.push(poste)
         setPosteProjetoLocal({
          id: Number(poste.codigo),
          codigoPoste: poste.codigo,
          equipamento:  false,
          esforcoMecanico:  false,
          subteranea:  false,
         });
         if (onChange) onChange(poste.codigo, posteProjetoLocal);
      } 
    
      }
      
    );
    //onSetPostesAdicionados(postesAdicionados)
    console.log(postesAdicionados, postesAdicionados.length)
    toast({
      description: "Postes Adicionados com sucesso",
      position: "top",
      variant: "sucesso",
    });
    setSavePostes && setSavePostes()
    setTimeout(() => {
      window.location.reload()
    }, 6000)
    
  }

  function removerMultiplosPostes(){
    toast({
      title: "Carregando",
      description: "Aguarde a conclusão das multiplas remocões! ",
      position: "top",
      //variant: "advertencia",
    });
    setLoading(true)
    let postesAdicionados : PosteResponseType[] = []
      todosPostesMapa?.forEach((poste) => {
      if(  longitudeQuadrado <= Number(poste.lon) &&  Number(poste.lon) <= longitudeQuadrado + (tamanhoQuadrado || 0) &&   latitudeQuadrado <= Number(poste.lat)  &&  Number(poste.lat) < latitudeQuadrado + (tamanhoQuadrado || 0) && poste.situacao === "D") {
        
        if (onRemove) onRemove(poste as unknown as Poste);
      } 
    
      });
    
      toast({
        title: "Sucesso",
        description: "Operacoes Concluidas com sucesso",
        position: "top",
        variant: "sucesso",
      });
      setRemovePostes && setRemovePostes()
      setTimeout(() => {
        window.location.reload()
      }, 6000)
  }

  useEffect(() => {
    
    if(openSquad && savePostes){
     adicionarMultiplosPostes()
    }

    if(openSquad && removePostes){
      removerMultiplosPostes()
    }
    
  }, [openSquad, savePostes, removePostes])

  // function desenharRetangulo(){
  //   map.on(L.Draw.Event.CREATED, function (event) {
  //   const layer = event.layer;
  //   // Adiciona o retângulo ao mapa
  //   layer.addTo(map);
  //   });
  // }

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        // setPosition({ lat, lng });
        // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        setLatitudeQuadrado(lat)
        setLongitudeQuadrado(lng)
        toast({
          title: "Alerta",
          description: "Clique no botão de Salvar Postes ou Remover Postes para realizar multiplas adicões ou remocões!",
          position: "top",
          variant: "advertencia",
        });
      },
    });
    return null;
  }

  // Renders
  const renderLayerControl = () => (
    <LayersControl position="topleft">
      <BaseLayer checked name="OpenStreetMap">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      <BaseLayer name="Carto Dark">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/'>CARTO</a>"
        />
      </BaseLayer>
    </LayersControl>
  )


  const renderRetangle = () =>  (
    <Rectangle
      bounds={ 
        [[latitudeQuadrado, longitudeQuadrado], 
        [latitudeQuadrado + (tamanhoQuadrado || 0) , longitudeQuadrado + (tamanhoQuadrado || 0)]]
      }
      color="red"
      fillColor="orange"
      fillOpacity={0.5}
      weight={2}
    />
  )

  const renderMap = () => (
    <MapContainer
      className={styles.map}
      center={centro}
      //zoom={11}
      zoom={18}
      minZoom={9} 
      maxZoom={27}
      scrollWheelZoom={true}
      ref={setMap}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Mapa Siga" />
       {marks?.map((p: Poste, index: number) => (
        <Fragment key={p.codigo}>
          <Mark
            poste={p}
            posteProjeto={mapAdicionados.get(p.codigo)}
            onRemove={onRemove}
            onChange={onChange}
            editavel={editavel}
            onSetPostesAdicionados={onSetPostesAdicionados}
            postesAdicionados={postesAdicionados}
          />
        </Fragment>
      ))}   
      {renderLayerControl()}
      {openSquad &&  (
        <>
          <MapClickHandler  />
          {renderRetangle()}
        </>
      )  }
      
      <AtualizarCentro centro={centro} centralizar={!bloquearCentralizacaoMapa} />
      <MapEnvents onBoundsChange={onBoundsChange} />
    </MapContainer>
  )

  const renderLoading = () => (
    <>
    <div className="w-32 text-center flex items-center justify-center">
      <span className="text-center" >Aguarde...  </span> <LoadingSpinner/>
    </div>
      
    </>
  )

  return (
    <>
      {!loading ? renderMap() : renderLoading() }
    </>
  );
};

export default Mapa;
