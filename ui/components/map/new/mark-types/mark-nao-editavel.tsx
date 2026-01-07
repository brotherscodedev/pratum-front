import { CircleMarker, Popup } from "react-leaflet";
import { Poste, ProjetoPoste } from "@/types";
const markRadius = 5;

const MarkNaoEditavel = ({
  poste,
  pp,
}: {
  poste: Poste;
  pp?: ProjetoPoste;
}) => {
    return 
    (
        <CircleMarker
          center={[Number(poste.lat), Number(poste.lon)]}
          radius={markRadius}
          color="blue"
        >
          <Popup>
            <div>
              <p className="font-bold">ID do poste: {poste.codigo}</p>
              <p>Latitude: {poste.lat}</p>
              <p>Longitude: {poste.lon}</p>
              <p>Características dos poste: </p>
              <p>
                <label htmlFor="equipamento" className="text-sm ">
                  Possui equipamento &nbsp;
                </label>
                &nbsp;
                {pp?.equipamento ? "Sim" : "Não"}
              </p>
              <p>
                <label htmlFor="mecanico" className="text-sm ">
                  Possui esforço mecânico superior &nbsp;
                </label>
                &nbsp;
                {pp?.esforcoMecanico ? "Sim" : "Não"}
              </p>
              <p>
                <label htmlFor="subterraneo" className="text-sm ">
                  Descida Subterrânea &nbsp;
                </label>
                &nbsp;
                {pp?.subteranea ? "Sim" : "Não"}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      );
} 

export default MarkNaoEditavel