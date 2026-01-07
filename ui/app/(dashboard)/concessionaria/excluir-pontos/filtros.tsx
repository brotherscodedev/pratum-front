import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExcluirPontos, ExcluirPontosFiltro } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BasicResponseType } from "@/services/http";
import { statusExclusaoPontosFiltro, statusProjetoMap } from "@/lib/utils";
import { ReactNode, useCallback } from "react";
import { Combobox } from "@/components/crud/combobox";

type FiltroExluirPontosPropsType = {
  values: ExcluirPontosFiltro;
  onPesquisar: () => void;
  onChange: (filtros: ExcluirPontosFiltro) => void;
  municipios: BasicResponseType[];
  ocupantes: BasicResponseType[];
  botao?: ReactNode;
  router?: any;
  onOpenModalNovaExclusao: () => void;
};

export const FiltrosExcluirPontos = ({
  values,
  onChange,
  onPesquisar,
  municipios,
  ocupantes,
  router,
  onOpenModalNovaExclusao,
}: FiltroExluirPontosPropsType) => {
  const renderFiltroDataSolicitacao = () => (
    <Label>
      Data
      <Input
        type="date"
        className="mt-2"
        value={
          values.dataSolicitacao
            ? new Date(values.dataSolicitacao).toISOString().split("T")[0]
            : ""
        }
        onChange={(e) => {
          const novaData = new Date(e.target.value);
          onChange({ ...values, dataSolicitacao: novaData });
        }}
      />
    </Label>
  );

  const renderFiltroMunicipio = () => (
    <Label>
      Município
      <div className="mt-2">
        <Select
          value={values?.nomeCidade}
          onValueChange={(value: any) =>
            onChange({ ...values, nomeCidade: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {municipios?.map((munucipio: any) => (
              <SelectItem key={munucipio.id} value={munucipio.descricao}>
                {munucipio.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Label>
  );

  const handleNavegarNovo = useCallback(() => {
    router.push("/ocupante/excluir-pontos/novo");
  }, []);

  const renderFiltroId = () => (
    <Label>
      ID Exclusão
      <Input
        type="number"
        value={values?.exclusaoId}
        className="mt-2"
        onChange={(e) => {
          onChange({ ...values, exclusaoId: e.target.value });
        }}
      />
    </Label>
  );

  // const renderFiltroEmpresaOcupante = () => (
  //   <Label>
  //     Ocupante
  //     <Input
  //       value={values?.nomeEmpresa}
  //       className="mt-2"
  //       onChange={(e) => {
  //         onChange({ ...values, nomeEmpresa: e.target.value });
  //       }}
  //     />
  //   </Label>
  // );
    const renderFiltroOcupante = () => (
      <Label>
        Ocupante
        <div className="mt-2">
          {/* <Combobox
            values={ocupantes}
            onChange={(value: any) => onChange({ ...values, nomeEmpresa: value })}//nomeEmpresa
          /> */}
          <Select
          value={values?.nomeEmpresa ?? undefined}
          onValueChange={(value: any) => onChange({ ...values, nomeEmpresa: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {ocupantes?.map((item) => (
              <SelectItem key={item.descricao} value={item.descricao}>
                {item.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
      </Label>
    );

  const renderFiltroSituacao = () => (
    <Label>
      Situação
      <div className="mt-2">
        <Select
          value={values?.status ?? undefined}
          onValueChange={(value: any) => onChange({ ...values, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {Object.entries(statusExclusaoPontosFiltro).map((v: string[]) => (
              <SelectItem key={v[0]} value={v[1]}>
                {v[1]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Label>
  );

  const renderFiltronomeProjeto = () => (
    <Label>
      Nome Projeto
      <Input
        value={values?.nomeProjeto}
        className="mt-2"
        onChange={(e) => {
          onChange({ ...values, nomeProjeto: e.target.value });
        }}
      />
    </Label>
  );

  const renderBotaoPequisar = () => (
    <Button
          onClick={onPesquisar}
          className="self-end bg-white text-black w-40 hover:bg-gray-400 p-4 p-4"
    >
      Pesquisar
    </Button>
  )

  return (
    <div className="flex flex-row bg-greenTertiary w-full p-5 -mb-4">
      <div className="flex flex-row space-x-4 bg-greenTertiary text-white w-full">
        {renderFiltroDataSolicitacao()}
        {/* {renderFiltroMunicipio()} */}
        {renderFiltroId()}
        {renderFiltroOcupante()}
        {renderFiltroSituacao()}
        {renderFiltronomeProjeto()}
        {renderBotaoPequisar()}
      </div>
    </div>
  );
};

export default FiltrosExcluirPontos;
