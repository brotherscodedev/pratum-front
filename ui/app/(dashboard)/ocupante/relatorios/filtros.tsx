import { FC } from "react";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
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
import { CidadeBasicResponseType } from "@/services/cidade-service/types";
import { FiltrosRelatoriosType } from "./types"

type FiltrosNotificacaoPropsType = {
  onPesquisar: () => void;
  values: FiltrosRelatoriosType;
  cidades?: CidadeBasicResponseType[];
  onChange: (filtros: FiltrosRelatoriosType) => void;
}

export const FiltrosNotificacaoRelatorios: FC<FiltrosNotificacaoPropsType> = ({
  onPesquisar,
  values,
  cidades,
  onChange,
}: any) => {
  return (
    <div className="flex flex-row space-x-4">
      <Label>
        Prazo
        <CalendarDateRangePicker
          className="mt-2"
          from={values?.prazoDe}
          to={values?.prazoAte}
          onChange={({ from, to }: any) =>
            onChange({
              ...values,
              prazoDe: from,
              prazoAte: to,
            })
          }
        />
      </Label>
      <Label>
        Cidade
        <div className="mt-2">
          <Select
            value={values?.cidadeId}
            onValueChange={(value) => onChange({ ...values, cidadeId: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem key={-1} value={""}>Todas</SelectItem>
              {cidades?.map((cidade: CidadeBasicResponseType) => (
                <SelectItem key={cidade.id} value={cidade.id.toString()}>{cidade.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Label>
      <Label>
        Motivo
        <Input
          value={values?.motivo}
          className="mt-2"
          onChange={(e) => {
            onChange({ ...values, motivo: e.target.value });
          }}
        />
      </Label>

      <Button onClick={onPesquisar} className="self-end">
        <Icons.search className="mr-2" />
        Pesquisar
      </Button>
    </div>
  );
};
