import { Poste, ProjetoPoste } from "@/types";
import { divIcon } from "leaflet";
import { CircleMarker, Popup } from "react-leaflet";
import { Button } from "../ui/button";
import { Ref, RefAttributes, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

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

const MarkNaoEditavel = ({
  poste,
  pp,
}: {
  poste: Poste;
  pp?: ProjetoPoste;
}) => (
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

const MarkDisponivel = ({ lat, lon, children }: any) => (
  <CircleMarker
    center={[Number(lat), Number(lon)]}
    radius={markRadius}
    color="green"
  >
    {children}
  </CircleMarker>
);

const MarkUtilizado = ({ lat, lon, children }: any) => (
  <CircleMarker
    center={[Number(lat), Number(lon)]}
    radius={markRadius}
    color="blue"
  >
    {children}
  </CircleMarker>
);

const MarkPopup = ({
  poste,
  posteProjeto,
  onChange,
  onRemove,
  adicionado = false,
  onSetPostesAdicionados,
  postesAdicionados
}: {
  poste: Poste;
  posteProjeto?: ProjetoPoste;
  onChange?: Function;
  onRemove?: Function;
  adicionado: boolean;
  onSetPostesAdicionados ?: () => void
  postesAdicionados ?: string[]
}) => {
  const [posteProjetoLocal, setPosteProjetoLocal] = useState<ProjetoPoste>({
    id: posteProjeto?.id,
    codigoPoste: poste.codigo,
    equipamento: posteProjeto?.equipamento || false,
    esforcoMecanico: posteProjeto?.esforcoMecanico || false,
    subteranea: posteProjeto?.subteranea || false,
  });

  const { toast } = useToast();

  return (
    <Popup key={"popup" + poste.codigo}>
      <div>
        <p className="font-bold">ID do poste: {poste.codigo}</p>
        <p>Latitude: {poste.lat}</p>
        <p>Longitude: {poste.lon}</p>
        <p>Características dos poste: {poste.caracteristicas}</p>

        <>
          <p>
            <label htmlFor="equipamento" className="text-sm ">
              Possui equipamento &nbsp;
            </label>
            <Checkbox
              id="equipamento"
              checked={posteProjetoLocal?.equipamento}
              onCheckedChange={() => {
                setPosteProjetoLocal({
                  ...posteProjetoLocal,
                  equipamento: !posteProjetoLocal?.equipamento,
                });
              }}
            />{" "}
            &nbsp;
            {posteProjetoLocal?.equipamento ? "Sim" : "Não"}
          </p>
          <p>
            <label htmlFor="mecanico" className="text-sm ">
              Possui esforço mecânico superior &nbsp;
            </label>
            <Checkbox
              id="mecanico"
              checked={posteProjetoLocal?.esforcoMecanico}
              onCheckedChange={() => {
                setPosteProjetoLocal({
                  ...posteProjetoLocal,
                  esforcoMecanico: !posteProjetoLocal?.esforcoMecanico,
                });
              }}
            />{" "}
            &nbsp;
            {posteProjetoLocal?.esforcoMecanico ? "Sim" : "Não"}
          </p>
          <p>
            <label htmlFor="subterraneo" className="text-sm ">
              Descida Subterrânea &nbsp;
            </label>
            <Checkbox
              id="subterraneo"
              checked={posteProjetoLocal?.subteranea}
              onCheckedChange={() => {
                setPosteProjetoLocal({
                  ...posteProjetoLocal,
                  subteranea: !posteProjetoLocal?.subteranea,
                });
              }}
            />{" "}
            &nbsp;
            {posteProjetoLocal?.subteranea ? "Sim" : "Não"}
          </p>
        </>

        <div className="flex justify-center mt-2">
          <Button
            variant="secondary"
            onClick={() => {
              setPosteProjetoLocal({
                ...posteProjetoLocal,
              });
              if (onChange) onChange(poste.codigo, posteProjetoLocal);
            }}
          >
            {adicionado ? "Atualizar" : "Adicionar"}
          </Button>

          {adicionado && (
            <>
              <Button
                variant="destructive"
                onClick={() => {
                  console.log("delete posteProjetoLocal", posteProjetoLocal);
                  setPosteProjetoLocal({
                    ...posteProjetoLocal,
                  });
                  if (onRemove) onRemove(poste);
                }}
              >
                Remover
              </Button>
            </>
          )}
        </div>
      </div>
    </Popup>
  );
};

interface MarkProps {
  poste: Poste;
  posteProjeto: ProjetoPoste | undefined;
  onRemove?: (poste: Poste) => void;
  onChange?: (codigo: string, poste: ProjetoPoste) => void;
  editavel: boolean;
  onAddPoste ?: () => void
  onSetPostesAdicionados ?: () => void
  postesAdicionados ?: string []
}

const Mark = ({
  poste,
  posteProjeto,
  onRemove,
  onChange,
  editavel,
  onAddPoste,
  onSetPostesAdicionados,
  postesAdicionados 
}: MarkProps) => {
  if (poste.situacao === "N") {
    return <MarkNaoDisponivel poste={poste} />;
  }

  if (!editavel) {
    return <MarkNaoEditavel poste={poste} pp={posteProjeto} />;
  }

  const adicionado = !!posteProjeto;

  if (adicionado) {
    return (
      <MarkUtilizado lat={poste.lat} lon={poste.lon}>
        <MarkPopup
          poste={poste}
          posteProjeto={posteProjeto}
          onChange={onChange}
          onRemove={onRemove}
          adicionado={adicionado}
        />
      </MarkUtilizado>
    );
  }


  return (
    <MarkDisponivel lat={poste.lat} lon={poste.lon}>
      <MarkPopup
        poste={poste}
        posteProjeto={posteProjeto}
        onChange={onChange}
        onRemove={onRemove}
        adicionado={adicionado}
        onSetPostesAdicionados={ () => onSetPostesAdicionados}
        postesAdicionados={postesAdicionados}
      />
    </MarkDisponivel>
  );
};
export default Mark;
