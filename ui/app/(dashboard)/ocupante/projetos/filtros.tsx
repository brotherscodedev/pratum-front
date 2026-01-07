import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { FiltrosProjetoType } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BasicResponseType } from "@/services/http";
import { statusProjetoMap } from "@/lib/utils";
import { ReactNode } from "react";
import { useRouter } from "next/router";

type FiltroProjetosPropsType = {
  values: FiltrosProjetoType;
  onPesquisar: () => void;
  onChange: (filtros: FiltrosProjetoType) => void;
  cidades: BasicResponseType[];
  botao?: ReactNode;
  router?: any
};

export const FiltrosProjeto = ({
  values,
  onChange,
  onPesquisar,
  cidades,
  router
}: FiltroProjetosPropsType) => {
  const renderFiltroCriacao = () => (
    <Label>
      Data
      <CalendarDateRangePicker
        className="mt-2 flex justify-center align-center"
        from={values?.criacaoDe}
        to={values?.criacaoAte}
        onChange={({ from, to }: any) =>
          onChange({
            ...values,
            criacaoDe: from,
            criacaoAte: to,
          })
        }
      />
    </Label>
  );

  const renderFiltroCidade = () => (
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
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {cidades?.map((cidade: any) => (
              <SelectItem value={cidade.id}>{cidade.descricao}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Label>
  );

  const renderFiltroStatus = () => (
    <Label>
      Situação
      <div className="mt-2">
        <Select
          value={values?.status}
          onValueChange={(value) => onChange({ ...values, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {Object.entries(statusProjetoMap).map((v: string[]) => (
              <SelectItem key={v[0]} value={v[0]}>
                {v[1]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Label>
  );

  const renderFiltroDescricao = () => (
    <Label>
      Descrição
      <Input
        value={values?.descricao}
        className="mt-2"
        onChange={(e) => {
          onChange({ ...values, descricao: e.target.value });
        }}
      />
    </Label>
  );

  return (
    <div className="flex flex-row bg-greenTertiary w-full p-5 -mb-4">
      <div className="flex flex-row space-x-4 bg-greenTertiary text-white w-full">
        {renderFiltroCriacao()}
        {renderFiltroStatus()}
        {renderFiltroCidade()}
        {renderFiltroDescricao()}
        <Button onClick={onPesquisar} className="self-end bg-white text-black w-40 hover:bg-gray-400 p-4 p-4">
          Pesquisar
        </Button>
      </div>
      <Button
        className="self-end bg-transparent text-white w-40 hover:bg-gray-400 p-4 p-4 border"
        title="Adicionar Projeto"
        onClick={() => router.push("/ocupante/projetos/novo")}
      >
        <Icons.add className="mr-2" />
        Novo
      </Button>
    </div>
  );
};

export default FiltrosProjeto;

