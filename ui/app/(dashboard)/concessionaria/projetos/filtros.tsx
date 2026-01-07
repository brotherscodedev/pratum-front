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
import { ProjetoStatusRascunho } from "@/services/projeto-service/types";
import { Combobox } from "@/components/crud/combobox";

type FiltroProjetosPropsType = {
  values: FiltrosProjetoType;
  onPesquisar: () => void;
  onChange: (filtros: FiltrosProjetoType) => void;
  cidades: BasicResponseType[];
  analistas: BasicResponseType[];
  ocupantes: BasicResponseType[];
};

export const FiltrosProjeto = ({
  values,
  onChange,
  onPesquisar,
  cidades,
  analistas,
  ocupantes,
}: FiltroProjetosPropsType) => {
  const renderFiltroSubmissao = () => (
    <Label>
      Submissão
      <CalendarDateRangePicker
        className="mt-2 flex justify-center align-center"
        from={values?.submissaoDe}
        to={values?.submissaoAte}
        onChange={({ from, to }: any) =>
          onChange({
            ...values,
            submissaoDe: from,
            submissaoAte: to,
          })
        }
      />
      {/* <input 
        type="date"
        className="mt-2"
        from={values?.submissaoDe as any}
        to={values?.submissaoAte as any}
        onChange={({ from, to }: any) =>
          onChange({
            ...values,
            submissaoDe: from,
            submissaoAte: to,
          })
        }  
      /> */}
    </Label>
  );

  // const renderFiltroCidade = () => (
  //   <Label>
  //     Cidade
  //     <div className="mt-2">
  //       <Select
  //         value={values?.cidadeId}
  //         onValueChange={(value) => onChange({ ...values, cidadeId: value })}
  //       >
  //         <SelectTrigger className="w-[180px]">
  //           <SelectValue placeholder="Selecione" />
  //         </SelectTrigger>
  //         <SelectContent>
  //           <SelectItem value={""}>Todas</SelectItem>
  //           {cidades?.map((cidade: any) => (
  //             <SelectItem value={cidade.id}>{cidade.descricao}</SelectItem>
  //           ))}
  //         </SelectContent>
  //       </Select>
  //     </div>
  //   </Label>
  // );

  const renderFiltroCidade = () => (
    <Label>
      Cidade
      <div className="mt-2">
        <Combobox
          values={cidades}
          onChange={(value: any) => onChange({ ...values, cidadeId: value })}
        />
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
            <SelectItem value={""}>Todos</SelectItem>
            {Object.entries(statusProjetoMap)
              .filter((e) => e[0] !== ProjetoStatusRascunho)
              .map((v: string[]) => (
                <SelectItem key={v[0]} value={v[0]}>
                  {v[1]}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </Label>
  );
  const renderFiltroParecer = () => (
    <Label>
      Parecer
      <CalendarDateRangePicker
        value={values.submissaoDe}
        className="mt-2 flex justify-center align-center"
        from={values?.parecerDe}
        to={values?.parecerAte}
        onChange={({ from, to }: any) =>
          onChange({
            ...values,
            parecerDe: from,
            parecerAte: to,
          })
        }
      />
    </Label>
    // {values.parecerDe !== undefined || values.parecerAte !== undefined &&  <Button onClick={ () =>  onChange({ ...values, parecerDe: undefined, parecerAte: undefined}) } className="self-end"> X </Button> }
  );

  const renderFiltroAnalista = () => (
    <Label>
      Analista
      <div className="mt-2">
        <Combobox
          values={analistas}
          onChange={(value: any) => onChange({ ...values, analistaId: value })}
        />
      </div>
    </Label>
  );

  const renderFiltroOcupante = () => (
    <Label>
      Ocupante
      <div className="mt-2">
        <Combobox
          values={ocupantes}
          value={values.ocupanteId}
          onChange={(value: any) => onChange({ ...values, ocupanteId: value })}
        />
      </div>
    </Label>
  );

  return (
    <div className="flex flex-row space-x-4">
      {renderFiltroSubmissao()}
      {renderFiltroStatus()}
      {renderFiltroCidade()}
      {renderFiltroAnalista()}
      {renderFiltroOcupante()}
      {renderFiltroParecer()}
      <Button onClick={onPesquisar} className="self-end">
        <Icons.search className="mr-2" />
        Pesquisar
      </Button>
    </div>
  );
};

export default FiltrosProjeto;
