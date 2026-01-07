import { Poste, ProjetoPoste } from "@/types";
import { CircleMarker, Popup } from "react-leaflet";
import { Button } from "../../ui/button";
import { Ref, RefAttributes, useRef, useState } from "react";
import { Checkbox } from "../../ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

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
        <span className="font-bold mb-2">ID: {poste.codigo}</span>
        <ul className="list-disc ml-3 mb-2" >
          <li> Material: {poste.material} </li>
          <li> Altura : {poste.altura} </li>
          <li> Estrutura: {poste.estrutura} </li>
          <li> Esforco : {poste.esforco} </li>
          <li> Em Uso : {poste.ocupantes } </li>
        </ul>

        <span className="font-bold mb-2" >LOCALIZACÃO:  </span>
        <ul className="list-disc ml-3 mb-2" >
          <li>Latitude: {poste.lat}</li>
          <li>Longitude: {poste.lon}</li>
        </ul>

      
        <span className="font-bold mb-2" >EMPRESAS:  </span>
        {poste.empresasOcupantes === null && <ul className="list-disc ml-3 mb-2" > <li> Nenhuma </li> </ul> }
        {poste.empresasOcupantes !== null && 
        (<>
          <ul className="list-disc mb-2">
            {poste.empresasOcupantes?.map(  (nome) => (
              <li> {nome} </li>
            ) )}
            
          </ul>
          </>) 
        }
        
        <span className="font-bold mb-2" >CARACTERISTICAS: </span>
        <ul className="list-disc ml-3 mb-2" >
          <li> Possui equipamento: {pp?.equipamento ? "Sim" : "Não"} </li>
          <li> Possui esforço mecânico superior : {pp?.esforcoMecanico ? "Sim" : "Não"} </li>
          <li> Descida Subterrânea: {pp?.subteranea ? "Sim" : "Não"} </li>
        </ul>
        {/*   */}
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
  onSetPostesAdicionados?: (codigo: string) => void
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
          {!adicionado ? (
          <Button
          variant="secondary"
          onClick={() => {
            if (!postesAdicionados?.includes(poste.codigo)) {
              onSetPostesAdicionados?.(poste.codigo);
              if (onChange) onChange(poste.codigo, posteProjetoLocal);
            } else {
              toast({
                description: `Poste : ${poste.codigo} já foi adicionado`,
                variant: "erro",
                position: "top",
              });
            }
          }}
        >
          Adicionar
        </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => {
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

interface MarkProps {
  poste: Poste;
  posteProjeto: ProjetoPoste | undefined;
  onRemove?: (poste: Poste) => void;
  onChange?: (codigo: string, poste: ProjetoPoste) => void;
  editavel: boolean;
  onSetPostesAdicionados ?: () => void
  postesAdicionados ?: string []
}

const MarkNew = ({
  poste,
  posteProjeto,
  onRemove,
  onChange,
  editavel,
  onSetPostesAdicionados,
  postesAdicionados 
}: MarkProps) => {
  if (poste.situacao === "N") {
    return <MarkNaoDisponivel poste={poste} />;
  }

  if (!editavel) {
    return <MarkNaoEditavel poste={poste} pp={posteProjeto} />;
  }

  const adicionado = posteProjeto !== undefined || (postesAdicionados?.includes(poste.codigo) ?? false);

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
        onSetPostesAdicionados={onSetPostesAdicionados}
        postesAdicionados={postesAdicionados}
      />
    </MarkDisponivel>
  );
};

export default MarkNew;
