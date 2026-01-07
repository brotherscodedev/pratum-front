import dynamic from 'next/dynamic';
export const Mapa = dynamic(() => import('./map'), { ssr: false });
// Novo mapa com funcionalidade de adicionar postes e mudar cor
export const MapaInterativo = dynamic(() => import('./new/map-new'), { ssr: false });