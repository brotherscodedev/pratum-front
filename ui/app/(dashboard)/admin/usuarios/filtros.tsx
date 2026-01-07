import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  usuariosFiltro } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BasicResponseType } from "@/services/http";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { empresasMock, mockFiltroPerfil, mockSituacaoFiltroPerfil } from "@/constants/data";
import adminService, { ConcessionariaType } from "@/services/admin-service";
import useAsync from "@/hooks/useAsync";

type FiltroUsuariosPropsType = {
  values: usuariosFiltro;
  onPesquisar: () => void;
  onChange: (filtros: usuariosFiltro) => void;
  botao?: ReactNode;
  router?: any;
};

export const FiltrosUsuarios = ({
  values,
  onChange,
  onPesquisar,
  router,
}: FiltroUsuariosPropsType) => {

  // Variaveis e constantes
  const [concessionarias, setConcessionarias] = useState<ConcessionariaType[]>([]);
  const [ocupantes, setOcupantes] = useState<any[]>(empresasMock);

  // Funcoes
  const handleNavigateByRegister = useCallback(() => {
    router.push("/admin/usuarios/cadastrar");
  }, []);

  const handleChange = (e : any) => {
    const valor = e.target.value;

    // Remove tudo que não for número
    const apenasNumeros = valor.replace(/\D/g, '');

    // Aplica a máscara de CPF: 000.000.000-00
    const formatado = apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    onChange({ ...values, cpf: formatado });
  };

    const { call: listarConcessionarias } = useAsync(async () => {
    
    try {
      const concessionariasResponse = await adminService.getConcessionarias();
      setConcessionarias(concessionariasResponse)
    } catch (error) {
      console.error(error)
    }

  }, []);

   useEffect(() => {
      listarConcessionarias()
    }, [])

  // Renders
  const renderFiltroOcupante = () => (
    <Label>
      Ocupante
      <div className="mt-2">
        <Select
          value={values?.ocupante}
          onValueChange={(value: any) => onChange({ ...values, ocupante: value })}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {ocupantes.map((v: any) => (
              <SelectItem key={v.empresa} value={v.empresa}>
                {v.empresa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Label>
  );

  const renderFiltroPerfil = () => (
    <Label>
      Pefil
      <div className="mt-2 ">
        <Select
          value={values?.perfil}
          onValueChange={(value: any) => onChange({ ...values, perfil: value })}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {mockFiltroPerfil.map((v: any) => (
              <SelectItem key={v.perfil} value={v.perfil}>
                {v.perfil}
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
          value={values?.situacao}
          onValueChange={(value: any) => onChange({ ...values, situacao: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
             {mockSituacaoFiltroPerfil.map((v: any) => (
              <SelectItem key={v.situacao} value={v.valor}>
                {v.situacao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Label>
  );

  const renderFiltronomeCpf = () => (
    <Label>
      CPF
      <Input
        value={values?.cpf}
        className="mt-2"
        maxLength={14}
        placeholder="000.000.000-00"
        onChange={(e) => {
          handleChange(e)
        }}
      />
    </Label>
  );

  const renderFiltroConcessionaria = () => (
   <Label>
      Concessionaria
      <div className="mt-2">
        <Select
          value={values?.concessionaria}
          onValueChange={(value: any) => onChange({ ...values, concessionaria: value })}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
             {concessionarias.map((v: any) => (
              <SelectItem key={v.nomeFantasia} value={v.nomeFantasia}>
                {v.nomeFantasia}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
        title="Adicionar Novos Usuarios"
        onClick={handleNavigateByRegister}
      >
        Novo
      </Button>
  )

  return (
    <div className="flex flex-row bg-greenTertiary w-full p-5 -mb-4">
      <div className="flex flex-row space-x-4 bg-greenTertiary text-white w-full">
        {renderFiltroConcessionaria()}
        {renderFiltroOcupante()}
        {renderFiltroPerfil()}
        {renderFiltronomeCpf()}
        {/* {renderFiltroSituacao()} */}
        {renderBotaoPequisar()}
      </div>
        {renderBotaoNovaExclusao()}
    </div>
  );
};

export default FiltrosUsuarios;
