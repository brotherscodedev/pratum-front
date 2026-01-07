import { FeatureGroup, LayersControl, MapContainer, Marker, Pane, Polygon, Popup, Rectangle, SVGOverlay, TileLayer, useMap, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../map.module.css";
import { Poste, ProjetoPoste } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MarkNew from "./mark-new";
import { useEventHandlers } from "@react-leaflet/core";
import IconGfonts from "@/components/icon-gfonts/icon";

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
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Mapa Siga" />
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

// const renderButtonsPoligons = () => (
//   <div className="topleft" >
//     <button> Adicionar </button> <IconGfonts id="crop_square" />
//   </div>
// )

const center: [number, number] = [51.505, -0.09]

const rectangle: [[number, number], [number, number]] = [
  [51.49, -0.08],
  [51.5, -0.06],
]

const renderLayerControlPoligon = () => (
  // <LayersControl position="topleft">
  //   <BaseLayer checked name="Quadrado">
  //     <TileLayer
  //       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //     />
  //   </BaseLayer>
  //   <BaseLayer name="Retangulo">
  //     <TileLayer
  //       url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  //       attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/'>CARTO</a>"
  //     />
  //   </BaseLayer>
  // </LayersControl>
  <LayersControl position="topleft">

<LayersControl.Overlay name="Feature group">
        <FeatureGroup pathOptions={{ color: 'purple' }}>
          <Popup>Popup in FeatureGroup</Popup>
          <Circle center={center} radius={200} />
          <Rectangle bounds={rectangle} />
        </FeatureGroup>
      </LayersControl.Overlay>
  </LayersControl>
)

const MapaInterativoNovoProjeto = ({
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

  
  const purpleOptions = { color: 'purple' }
  const polygon = [
      [centro],
      [centro],
      [centro],
    // [51.515, -0.09],
    // [51.52, -0.1],
    // [51.52, -0.12],
  ]

  return (
    <MapContainer
      className={styles.map}
      center={centro}
      zoom={10}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Mapa Siga" />
       {marks?.map((p: Poste, index: number) => (
        <div key={p.codigo} id={p.codigo}>
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
        
       {/* <Polygon pathOptions={purpleOptions} positions={polygon} /> */}
      <MapEnvents onBoundsChange={onBoundsChange} />
      <AtualizarCentro centro={centro} />
      {renderLayerControl()}  
      {/* {renderLayerControlPoligon()} */}
      {/* {renderButtonsPoligons()} */}
      <MinimapControl position="topright" zoom={8} />
    </MapContainer>
    
  );
};

export default MapaInterativoNovoProjeto;
