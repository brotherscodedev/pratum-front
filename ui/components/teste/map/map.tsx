import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./map.module.css";
import Mark from "./mark";
import { Poste, ProjetoPoste } from "@/types";
import { useEffect, useRef, useState } from "react";
import  {listPostMock}   from "@/constants/data";
import { PosteResponseType } from "@/services/geral/types";

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
  navigateByPosition ?: Position
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

interface Position{
  lat: number
  lng: number
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
  });
  return null;
}

const filtrarLista = (
  lista: Poste[],
  adicionados: Map<string, ProjetoPoste>,
  bounds?: Bounds
) => {
  const novaLista = bounds
    ? lista.filter((p) => {
        return (
          Number(p.lat) >= bounds._southWest.lat &&
          Number(p.lat) <= bounds._northEast.lat &&
          Number(p.lon) >= bounds._southWest.lng &&
          Number(p.lon) <= bounds._northEast.lng
        );
      })
    : lista;

  if (novaLista.length > MAX_POINTS) {
    const percent = MAX_POINTS / novaLista.length;
    return novaLista.filter(
      (p) => adicionados.has(p.codigo) || Math.random() < percent
    );
  }

  return novaLista;
};

const MapaTeste = ({
  lista,
  centro,
  adicionados,
  setPostes,
  onRemove,
  onChange,
  editavel = true,
  onSetPostesAdicionados,
  postesAdicionados,
  navigateByPosition 
}: MapProps) => {
  const mapAdicionados = new Map(
    adicionados.map((obj) => [obj.codigoPoste, obj])
  );

  const [marks, setMarks] = useState<Poste[]>(
    filtrarLista(lista, mapAdicionados)
  );

  const [map, setMap] = useState<L.Map | null>(null);

  const onBoundsChange = (bounds: Bounds) => {
    setMarks(filtrarLista(lista, mapAdicionados, bounds));
  };

  function LocationMarker() {
    const [position, setPosition] = useState<Position | null>(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound() {
        if (navigateByPosition) {
          setPosition(navigateByPosition)
          map.flyTo(navigateByPosition, map.getZoom())
          console.log(position)
        }
      },
    })

  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  //const [marksMock, setMarksMock] = useState(listPostMock)


  return (
    <MapContainer
      className={styles.map}
      center={centro}
      zoom={15}
      scrollWheelZoom={true}
      ref={setMap}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Mapa Siga" />
       {marks?.map((p: Poste, index: number) => (
        <div id={p.codigo}>
          <Mark
            poste={p}
            posteProjeto={mapAdicionados.get(p.codigo)}
            onRemove={onRemove}
            onChange={onChange}
            editavel={editavel}
            excutarOperacoesExclusaoPontos={true}
            onSetPostesAdicionados={() => onSetPostesAdicionados}
            postesAdicionados={postesAdicionados}
            closePopUp={() => map?.closePopup }
            postes={adicionados}
            setPostes={() => setPostes}
          />
        </div>
      ))}   
        {/* {marksMock?.map((poste , index: number) => (
          <> 
          <Mark
            poste={poste}
            editavel={true}
          />  
          </>
        ))}  */}
          
          <LocationMarker />
      {/* <MapEnvents onBoundsChange={onBoundsChange} /> */}
    </MapContainer>
  );
};

export default MapaTeste;
