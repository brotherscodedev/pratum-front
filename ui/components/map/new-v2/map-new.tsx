import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';

function MapEventsHandler({ onMapChange }: { onMapChange: any }) {
  // useMapEvents permite escutar eventos do mapa
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      // Chama a função passada como prop para atualizar o estado
      onMapChange({ center, zoom });
    },
    zoomend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      onMapChange({ center, zoom });
    },
  });
  return null; // Este componente não renderiza nada visualmente
}

function AtualizarCentro({ centro }: { centro: any }) {
  const map = useMap();

  useEffect(() => {
    if (centro) {
      map.setView(centro, map.getZoom()); // Atualiza o centro mantendo o zoom atual
    }
  }, [centro, map]);

  return null;
}

function MeuMapa() {
  const [mapaInfo, setMapaInfo] = useState({
    center: [51.505, -0.09] as [number, number],
    zoom: 13,
  });

  const handleMapChange = useCallback(({ center, zoom }: { center: any, zoom: any }) => {
    setMapaInfo({ center: [center.lat, center.lng], zoom });
  }, []);

  return (
    <MapContainer center={mapaInfo.center} zoom={mapaInfo.zoom} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* Componente que escuta eventos do mapa */}
      <MapEventsHandler onMapChange={handleMapChange} />
      {/* Aqui você pode colocar marcadores ou outros componentes que dependem do estado do mapa */}
    </MapContainer>
  );
}

export default MeuMapa;