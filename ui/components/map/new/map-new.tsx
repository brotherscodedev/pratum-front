import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "../map.module.css";
import { Poste, ProjetoPoste } from "@/types";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import MarkNew from "./mark-new";

const MAX_POINTS = 1000;
interface MapProps {
  lista: Poste[];
  centro: [number, number];
  adicionados: ProjetoPoste[];
  editavel?: boolean;
  onRemove?: (poste: Poste) => Promise<void>;
  onChange?: (codigoPoste:string, poste: ProjetoPoste) => Promise<void>;
  onSetPostesAdicionados ?: (codigoPoste: string) => void
  onRemovePoste?: (codigoPoste: string) => void
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

const MapaInterativo = ({
  lista,
  centro,
  adicionados,
  onRemove,
  onChange,
  editavel = true,
  onSetPostesAdicionados,
  onRemovePoste,
  postesAdicionados 
}: MapProps) => {
  const mapAdicionados = useMemo(() => {
    return new Map(adicionados.map((obj) => [obj.codigoPoste, obj]));
  }, [adicionados]);
  const [map, setMap] = useState<L.Map | null>(null);

  const [bloquearCentralizacaoMapa, setBloquearCentralizacaoMapa] = useState(false);


  const [marks, setMarks] = useState<Poste[]>(
    filtrarLista(lista, mapAdicionados)
  );

  const onBoundsChange = (bounds: Bounds) => {
    setMarks(filtrarLista(lista, mapAdicionados, bounds));
  };

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


  useEffect(() => {
    setMarks(filtrarLista(lista, mapAdicionados));
  }, [lista, mapAdicionados]);

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
  return (
    <MapContainer
      className={styles.map}
      center={centro}
      zoom={11}
      scrollWheelZoom={true}
      ref={setMap}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Mapa Siga" />
       {marks?.map((p: Poste, index: number) => (
        <Fragment key={p.codigo}>
          <MarkNew
            poste={p}
            posteProjeto={mapAdicionados.get(p.codigo)}
            onRemove={onRemove}
            onChange={onChange}
            editavel={editavel}
            onSetPostesAdicionados={onSetPostesAdicionados}
            onRemovePoste={onRemovePoste}
            postesAdicionados={postesAdicionados}
          />
        </Fragment>
      ))}   
           
      <MapEnvents onBoundsChange={onBoundsChange} />
      <AtualizarCentro centro={centro} centralizar={!bloquearCentralizacaoMapa} />
    </MapContainer>
  );
};

export default MapaInterativo;
