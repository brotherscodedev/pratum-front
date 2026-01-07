import { FC } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConcessionariaType } from "@/services/admin-service/types";
import { CidadeResponseType } from "@/services/cidade-service/types";

export type FiltrosPontosType = {
  cidadeCodigo: string;
  concessionariaId: string;
  posteCodigo: string;
  endereco: string;
};
type FiltrosPontosPropsType = {
  onPesquisar: () => void;
  values: FiltrosPontosType;
  cidades?: CidadeResponseType[];
  concessionarias?: ConcessionariaType[];
  onChange: (filtros: FiltrosPontosType) => void;
  setCidade: (cidade: CidadeResponseType) => void;
};

export const FiltrosPontos: FC<FiltrosPontosPropsType> = ({
  onPesquisar,
  values,
  cidades,
  concessionarias,
  onChange,
  setCidade,
}) => {
  return (
    <div className="flex flex-row space-x-4">
      <Label>
        Concessionaria
        <div className="mt-2">
          <Select
            value={values?.concessionariaId}
            onValueChange={(value) =>
              onChange({ ...values, concessionariaId: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={""}>Todas</SelectItem>
              {concessionarias?.map((c: ConcessionariaType) => (
                <SelectItem value={c.id + ""}>{c.nomeFantasia}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Label>
      <Label>
        Cidade
        <div className="mt-2">
          <Select
            value={values?.cidadeCodigo}
            onValueChange={(value) => {
              onChange({ ...values, cidadeCodigo: value });
              setCidade(
                cidades?.find(
                  (c) => c.codigoIbge === value
                ) as CidadeResponseType
              );
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={""}>Todas</SelectItem>
              {cidades?.map((cidade: CidadeResponseType) => (
                <SelectItem value={cidade.codigoIbge}>{cidade.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Label>
      <Label>
        ID Poste
        <Input
          value={values?.posteCodigo}
          className="mt-2"
          onChange={(e) => {
            onChange({ ...values, posteCodigo: e.target.value });
          }}
        />
      </Label>
      <Label>
        Endereço
        <Input
          value={values?.endereco}
          className="mt-2"
          onChange={(e) => {
            onChange({ ...values, endereco: e.target.value });
          }}
        />
      </Label>

      <Button onClick={onPesquisar} className="text-white self-end">
        <Icons.search className="mr-2" />
        Pesquisar
      </Button>
    </div>
  );
};
