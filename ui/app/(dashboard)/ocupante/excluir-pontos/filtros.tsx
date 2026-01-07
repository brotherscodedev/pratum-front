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

type FiltroExluirPontosPropsType = {
  values: Partial<ExcluirPontosFiltro>;
  onPesquisar: () => void;
  onChange: (filtros: Partial<ExcluirPontosFiltro>) => void;
  municipios: BasicResponseType[];
  botao?: ReactNode;
  router?: any;
  onOpenModalNovaExclusao: () => void;
};

export const FiltrosExcluirPontos = ({
  values,
  onChange,
  onPesquisar,
  municipios,
  router,
  onOpenModalNovaExclusao,
}: FiltroExluirPontosPropsType) => {

  // Funcoes
  const handleNavegarNovo = useCallback(() => {
    router.push("/ocupante/excluir-pontos/novo");
  }, []);

  // Renders
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

  const renderFiltroSituacao = () => (
    <Label>
      Situação
      <div className="mt-2">
        <Select
          value={values?.status || ""}
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
        value={values?.descricaoProjeto}
        className="mt-2"
        onChange={(e) => {
          onChange({ ...values, descricaoProjeto: e.target.value });
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

  const renderBotaoNovaExclusao = () => (
    <Button
        className="self-end bg-white text-black w-40 hover:bg-gray-400 p-4 p-4"
        title="Adicionar Exclusão Pontos"
        onClick={onOpenModalNovaExclusao}
      >
        Nova Exclusão
      </Button>
  )

  return (
    <div className="flex flex-row bg-greenTertiary w-full p-5 -mb-4">
      <div className="flex flex-row space-x-4 bg-greenTertiary text-white w-full">
        {renderFiltroDataSolicitacao()}
        {/* {renderFiltroMunicipio()} */}
        {renderFiltroId()}
        {renderFiltroSituacao()}
        {renderFiltronomeProjeto()}
        {renderBotaoPequisar()}
      </div>
        {renderBotaoNovaExclusao()}
    </div>
  );
};

export default FiltrosExcluirPontos;
