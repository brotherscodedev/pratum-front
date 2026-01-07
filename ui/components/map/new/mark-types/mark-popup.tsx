import { CircleMarker, Popup } from "react-leaflet";
import { Poste, ProjetoPoste } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  export  default MarkPopup