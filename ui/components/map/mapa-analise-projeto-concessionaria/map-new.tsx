import { LayersControl, MapContainer, Marker, Pane, Popup, Rectangle, SVGOverlay, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../map.module.css";
import { Poste, ProjetoPoste } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MarkNew from "./mark-new";
import { useEventHandlers } from "@react-leaflet/core";

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const BOUNDS_STYLE = { weight: 1 }

function MinimapBounds({ parentMap, zoom }: { parentMap: any, zoom: number }) {
  const minimap = useMap()

  // Clicking a point on the minimap sets the parent's map center
  const onClick = useCallback(
    (e: any) => {
      parentMap.setView(e.latlng, parentMap.getZoom())
    },
    [parentMap],
  )
  useMapEvents({
    click: onClick
  })

  // Keep track of bounds in state to trigger renders
  const [bounds, setBounds] = useState(parentMap.getBounds())
  const onChange = useCallback(() => {
    setBounds(parentMap.getBounds())
    // Update the minimap's view to match the parent map's center and zoom
    minimap.setView(parentMap.getCenter(), zoom)
  }, [minimap, parentMap, zoom])

  // Listen to events on the parent map
  // const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [])
  // useEventHandlers({ instance: parentMap }, handlers)

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />
}

function MinimapControl({ position, zoom }: { position: any, zoom: number }) {
  const parentMap = useMap()
  const mapZoom = zoom || 0

  // Memoize the minimap so it's not affected by position changes
  const minimap = useMemo(
    () => (
      <MapContainer
        style={{ height: 80, width: 80 }}
        center={parentMap.getCenter()}
        zoom={mapZoom}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  />
        <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
      </MapContainer>
    ),
    [],
  )

const positionClass =
    (position && POSITION_CLASSES[position as keyof typeof POSITION_CLASSES]) || POSITION_CLASSES.topright
  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  )
}


const MAX_POINTS = 1000;
interface MapProps {
  lista: Poste[];
  centro: [number, number];
  adicionados: ProjetoPoste[];
  editavel?: boolean;
  onRemove?: (poste: Poste) => Promise<void>;
  onChange?: (codigoPoste:string, poste: ProjetoPoste) => Promise<void>;
  onSetPostesAdicionados ?: () => void
  postesAdicionados ?: string []
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

interface MapEventsProps {
  onBoundsChange: (bounds: Bounds) => void;
}
function MapEnvents({ onBoundsChange }: MapEventsProps) {
  const map = useMapEvents({
    // dragend: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // zoomend: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // mousedown: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // overlayadd: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // click: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // mouseover: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // move: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // dragstart: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
    // overlayremove: (e) => {
    //   onBoundsChange(e.target.getBounds());
    // },
  });
  return null;
}

function AtualizarCentro({ centro } : any) {
  const map = useMap();

  useEffect(() => {
    if (centro) {
      map.setView(centro, map.getZoom()); // Atualiza o centro mantendo o zoom atual
    }
  }, [centro, map]);

  return null;
}

const { BaseLayer, Overlay } = LayersControl;

const filtrarLista = (
  lista: Poste[],
  adicionados: Map<string, ProjetoPoste>,
  bounds?: Bounds
) => {
  const dentroDaTela = bounds
    ? lista.filter((p) => {
        return (
          Number(p.lat) >= bounds._southWest.lat &&
          Number(p.lat) <= bounds._northEast.lat &&
          Number(p.lon) >= bounds._southWest.lng &&
          Number(p.lon) <= bounds._northEast.lng
        );
      })
    : lista;

  const comAdicionados = lista.filter((p) => adicionados.has(p.codigo));

  const todos = Array.from(new Set([...dentroDaTela, ...comAdicionados]));

  if (todos.length > MAX_POINTS) {
    const percent = MAX_POINTS / todos.length;
    return todos.filter(
      (p) => adicionados.has(p.codigo) || Math.random() < percent
    );
  }

  return todos;
};

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

const MapaInterativoAnaliseprojeto = ({
  lista,
  centro,
  adicionados,
  onRemove,
  onChange,
  editavel = true,
  onSetPostesAdicionados,
  postesAdicionados 
}: MapProps) => {
  const mapAdicionados = useMemo(() => {
    return new Map(adicionados.map((obj) => [obj.codigoPoste, obj]));
  }, [adicionados]);

  const [marks, setMarks] = useState<Poste[]>(
    filtrarLista(lista, mapAdicionados)
  );

  const onBoundsChange = (bounds: Bounds) => {
    setMarks(filtrarLista(lista, mapAdicionados, bounds));
  };

  useEffect(() => {
    setMarks(filtrarLista(lista, mapAdicionados));
  }, [lista, mapAdicionados, postesAdicionados]);

 
  


  return (
    <MapContainer
      className={styles.map}
      center={centro}
      zoom={18}
      minZoom={9}
      maxZoom={27}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Mapa Siga" />
       {marks?.map((p: Poste, index: number) => (
        <div key={ `${p.codigo} ${index}` } id={p.codigo}>
          <MarkNew
            poste={p}
            posteProjeto={mapAdicionados.get(p.codigo)}
            onRemove={onRemove}
            onChange={onChange}
            editavel={editavel}
            onSetPostesAdicionados={onSetPostesAdicionados}
            postesAdicionados={postesAdicionados}
          />
        </div>
      ))}   
      
      <MapEnvents onBoundsChange={onBoundsChange} />
      <AtualizarCentro centro={centro} />
      {renderLayerControl()}  
      {/* <MinimapControl position="topright" /> */}
    </MapContainer>
    
  );
};

export default MapaInterativoAnaliseprojeto;
