import { CircleMarker, Popup } from "react-leaflet";
const markRadius = 5;

const MarkUtilizado = ({ lat, lon, children }: any) => {
   
    return 
        (
            <CircleMarker
            center={[Number(lat), Number(lon)]}
            radius={markRadius}
            color="blue"
            >
            {children}
            </CircleMarker>
        );
} 

export default MarkUtilizado