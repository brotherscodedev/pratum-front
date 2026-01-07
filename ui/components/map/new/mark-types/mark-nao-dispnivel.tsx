import { CircleMarker, Popup } from "react-leaflet";
import { Poste } from "@/types";
const markRadius = 5;

const MarkNaoDisponivel = ({ poste }: { poste: Poste }) => {

    return 
    (
        <CircleMarker
          center={[Number(poste.lat), Number(poste.lon)]}
          radius={markRadius}
          color="red"
        >
          <Popup>
            <div>
              <p className="font-bold">ID do poste: {poste.codigo}</p>
              <p>
                Status: <span className="font-bold red">Não Disponivel</span>
              </p>
            </div>
          </Popup>
        </CircleMarker>
      );

} 

export default MarkNaoDisponivel