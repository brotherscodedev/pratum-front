import { CircleMarker, Popup } from "react-leaflet";
const markRadius = 5;

const MarkDisponivel = ({ lat, lon, children }: any) => {

    return
    (
        <CircleMarker
          center={[Number(lat), Number(lon)]}
          radius={markRadius}
          color="green"
        >
          {children}
        </CircleMarker>
      );
}

export default MarkDisponivel
   