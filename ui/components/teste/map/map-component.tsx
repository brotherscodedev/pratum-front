import dynamic from 'next/dynamic';
export const Mapa = dynamic(() => import('./map'), { ssr: false });