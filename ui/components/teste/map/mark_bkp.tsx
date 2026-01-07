import { Poste, ProjetoPoste } from "@/types";
import { divIcon } from "leaflet";
import { CircleMarker, Popup } from "react-leaflet";
import { Button } from "../../ui/button";
import { useState } from "react";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";

const svgIconRed = divIcon({
  html: `
<svg
  xmlns="http://www.w3.org/2000/svg"
>
  <circle r="4" cx="10" cy="10" fill="red" />
</svg>`,
  className: "svg-icon",
  // iconSize: [2, 2],
  // iconAnchor: [0, 0],
});

const svgIconGreen = divIcon({
  html: `
<svg
  xmlns="http://www.w3.org/2000/svg"
>
  <circle r="4" cx="10" cy="10" fill="green" />
</svg>`,
  className: "svg-icon",
  // iconSize: [2, 2],
  // iconAnchor: [0, 0],
});

const svgIconBlue = divIcon({
  html: `
<svg
  xmlns="http://www.w3.org/2000/svg"
>
  <circle r="4" cx="10" cy="10" fill="blue" />
</svg>`,
  className: "svg-icon",
  // iconSize: [2, 2],
  // iconAnchor: [0, 0],
});

const svgIconOrange = divIcon({
  html: `
<svg
  xmlns="http://www.w3.org/2000/svg"
>
  <circle r="4" cx="10" cy="10" fill="orange" />
</svg>`,
  className: "svg-icon",
  // iconSize: [2, 2],
  // iconAnchor: [0, 0],
});
// const Mark = ({ x, y, z=0, color="red", borda="red" }: any) => {
//     return (
//       <SVGOverlay attributes={{ stroke: borda }} bounds={[[x, x ], [y, y]]}>
//         <circle r="4" cx="10" cy="10" fill={color} />
//       </SVGOverlay>
//     );
// }

const markRadius = 5;

const MarkNaoDisponivel = ({ poste }: { poste: Poste }) => (
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

const popupPoste = (
  editavel: boolean,
  poste: Poste,
  posteProjeto?: ProjetoPoste,
  onAdd?: Function,
  onRemove?: Function,
  onChange?: Function,
  setLoading?: Function
) => {
  const add = !posteProjeto && !!onAdd;
  return (
    <Popup>
      <div>
        <p className="font-bold">ID do poste: {poste.codigo}</p>
        <p>Latitude: {poste.lat}</p>
        <p>Longitude: {poste.lon}</p>
        <p>Características dos poste: {poste.caracteristicas}</p>
        {add && (
          <>
            <p>Possui equipamento: {poste.possuiEquipamento ? "Sim" : "Não"}</p>
            <p>
              Possui esforço mecânico superior:{" "}
              {poste.possuiEMS ? "Sim" : "Não"}
            </p>
            <p>Descida Subterrânea: {poste.descidaSub ? "Sim" : "Não"}</p>
          </>
        )}
        {!add && (
          <>
            <p>
              <label htmlFor="equipamento" className="text-sm ">
                Possui equipamento &nbsp;
              </label>
              {editavel && (
                <Checkbox
                  id="equipamento"
                  checked={posteProjeto?.equipamento}
                  onCheckedChange={() => {
                    if (onChange)
                      onChange({
                        ...posteProjeto,
                        equipamento: !posteProjeto?.equipamento,
                      });
                  }}
                />
              )}{" "}
              &nbsp;
              {posteProjeto?.equipamento ? "Sim" : "Não"}
            </p>
            <p>
              <label htmlFor="mecanico" className="text-sm ">
                Possui esforço mecânico superior &nbsp;
              </label>
              {editavel && (
                <Checkbox
                  id="mecanico"
                  checked={posteProjeto?.esforcoMecanico}
                  onCheckedChange={() => {
                    if (onChange)
                      onChange({
                        ...posteProjeto,
                        esforcoMecanico: !posteProjeto?.esforcoMecanico,
                      });
                  }}
                />
              )}{" "}
              &nbsp;
              {posteProjeto?.esforcoMecanico ? "Sim" : "Não"}
            </p>
            <p>
              <label htmlFor="subterraneo" className="text-sm ">
                Descida Subterrânea &nbsp;
              </label>
              {editavel && (
                <Checkbox
                  id="subterraneo"
                  checked={posteProjeto?.subteranea}
                  onCheckedChange={() => {
                    if (onChange)
                      onChange({
                        ...posteProjeto,
                        subteranea: !posteProjeto?.subteranea,
                      });
                  }}
                />
              )}{" "}
              &nbsp;
              {posteProjeto?.subteranea ? "Sim" : "Não"}
            </p>
          </>
        )}

        <div className="flex justify-center mt-2">
          {editavel && add && (
            <Button
              variant="secondary"
              onClick={() => {
                if (setLoading) setLoading(true);
                if (onAdd) onAdd(poste);
              }}
            >
              Adicionar
            </Button>
          )}
          {editavel && !add && (
            <Button
              variant="destructive"
              onClick={() => {
                if (setLoading) setLoading(true);
                if (onRemove) onRemove(poste);
              }}
            >
              Remover
            </Button>
          )}
        </div>
      </div>
    </Popup>
  );
};

const MarkDisponivel = ({
  poste,
  onAdd,
}: {
  poste: Poste;
  onAdd?: (poste: Poste) => void;
}) => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return null;
  }

  return (
    <CircleMarker
      center={[Number(poste.lat), Number(poste.lon)]}
      radius={markRadius}
      color="green"
    >
      {popupPoste(
        true,
        poste,
        undefined,
        onAdd,
        () => null,
        () => null,
        setLoading
      )}
    </CircleMarker>
  );
};
const MarkAdicionado = ({
  poste,
  posteProjeto,
  editavel,
  onRemove,
  onChange,
}: {
  poste: Poste;
  posteProjeto: ProjetoPoste;
  editavel: boolean;
  onRemove?: (poste: Poste) => void;
  onChange?: (poste: ProjetoPoste) => void;
}) => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return null;
  }

  return (
    <CircleMarker
      center={[Number(poste.lat), Number(poste.lon)]}
      radius={markRadius}
      color="blue"
    >
      {popupPoste(
        editavel,
        poste,
        posteProjeto,
        () => null,
        onRemove,
        onChange,
        setLoading
      )}
    </CircleMarker>
  );
};
interface MarkProps {
  poste: Poste;
  posteProjeto: ProjetoPoste | undefined;
  onAdd?: (poste: Poste) => void;
  onRemove?: (poste: Poste) => void;
  onChange?: (poste: ProjetoPoste) => void;
  editavel: boolean;
}

const Mark = ({
  poste,
  posteProjeto,
  onAdd,
  onRemove,
  onChange,
  editavel,
}: MarkProps) => {
  if (!!posteProjeto) {
    return (
      <MarkAdicionado
        poste={poste}
        posteProjeto={posteProjeto}
        onRemove={onRemove}
        onChange={onChange}
        editavel={editavel}
      />
    );
  }
  if (poste.situacao === "D") {
    return <MarkDisponivel poste={poste} onAdd={onAdd} />;
  }
  if (poste.situacao === "N") {
    return <MarkNaoDisponivel poste={poste} />;
  }
  return null;

};
export default Mark;
