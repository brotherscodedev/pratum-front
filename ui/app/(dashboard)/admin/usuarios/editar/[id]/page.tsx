'use client'
import { useParams } from "next/navigation";
import { useEffect, useState , useCallback} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Heading } from "@/components/ui/heading";
import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { white } from "tailwindcss/colors";
import useAsync from "@/hooks/useAsync";
import { LoadingSpinner } from "@/components/spinner";
import { useRouter } from "next/navigation";
import UsuarioService, { UsuarioServiceType } from "@/services/admin-service/usuario";
import { empresasMock, mockFiltroPerfil, modulosMock } from "@/constants/data";
import adminService, { ConcessionariaType } from "@/services/admin-service";
import concessionariaService from "@/services/concessionaria/concessionaria-service";
import { OcupanteBasicResponseType } from "@/services/ocupante/ocupante-service";
import { BasicResponseType } from "@/services/http";
import { PaginationState } from "@tanstack/react-table";
import { usuariosFiltro, usuariosListados } from "@/types";
import HistoricoUsuarioModal from "../../modal-historico-usuarios";



const formSchema = z.object({
  id: z.number().min(0, "ID").max(365).optional(),
  nome: z.string().min(2, "Nome obrigatorio").max(70),
  email: z.string().min(3, "Tamanho minimo 3 caractes").max(20),
  telefone: z.string().min(11, "Dever ter pelo menos 9 digitos").max(13),
  cpf: z.string().min(13, "Coloque um CPF valido").max(13),
  perfil: z.string().max(30),
  empresaOcupante: z.string().max(100).optional(),
  concessionaria: z.string().max(70).optional(),
  situacao: z.string().includes("Ativo").includes("Inativo"),
  modulos: z.string().max(25)
});

type UsuarioFormValues = z.infer<typeof formSchema>;

const EditarUsuario = () => {

  // Variaveis e constantes
  const params = useParams()
  const { toast } = useToast();
  const router = useRouter();

  const [concessionarias, setConcessionarias] = useState<ConcessionariaType[]>([]);// OcupanteBasicResponseType
  const [empresas, setEmpresas] = useState<any[]>(empresasMock);
  const [usuarios, setUsuarios] = useState<UsuarioServiceType[]>([]) 
  const [count, setCount] = useState<number>(0)
  const [isModalUsuarioHistoricoOpen, setisModalUsuarioHistoricoOpen] = useState(false)
  const [historico, setHistorico] = useState([]) 
  const [filtros, setFiltros] = useState<Partial<usuariosFiltro>>({
      ocupante: "",
      perfil: "",
      cpf: "",
      situacao: ""
  });
  const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
  });
  
  const breadcrumbItems = [
    { title: "Usuarios", link: `/admin/usuarios` },
    { title: "Editar de Usuario", link: `/admin/usuarios/editar/${params.id}` },
  ];

  const form  = useForm<UsuarioFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      perfil: "",
      empresaOcupante: "",
      concessionaria: "",
      situacao: ""
    },
  });

  // Funcoes 

  function validarCpfCadastrado(cpf : string){
    let res = []
    res = usuarios.filter( (usuario) => usuario.cpf === cpf )
    if(res.length === 0){
      return true
    } else{
      return false
    }

  }

  function validarCPF(cpf : string) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, '');

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let primeiroDigito = 11 - (soma % 11);
  if (primeiroDigito > 9) primeiroDigito = 0;
  if (parseInt(cpf.charAt(9)) !== primeiroDigito) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  let segundoDigito = 11 - (soma % 11);
  if (segundoDigito > 9) segundoDigito = 0;
  if (parseInt(cpf.charAt(10)) !== segundoDigito) return false;

  return true;
  }

  function validarEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleChange = (e : any) => {
      const valor = e.target.value;

      // Remove tudo que não for número
      const apenasNumeros = valor.replace(/\D/g, '');

      // Aplica a máscara de CPF: 000.000.000-00
      const formatado = apenasNumeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      form.setValue("cpf", formatado)
      //onChange({ ...values, cpf: formatado });
  };

   const handleChangeTelefone = (event : any) => {

    const telefoneFormatado = event.target.value.replace(/^(\d{2})(\d.*)/, '($1) $2'); //  replace(/^(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
    
    form.setValue("telefone", telefoneFormatado)
  };

  function validarFormulario(){
    if(form.getValues().nome.length === 0 || form.getValues().email.length === 0 || form.getValues().telefone.length === 0 || form.getValues().cpf.length === 0 || form.getValues().perfil.length === 0 || form.getValues().situacao.length === 0 ){
      toast({
          title: "Formulario Invalido!",
          description: "Campos nome, email, telefone, cpf, perfil e situacão obrigatorios",
          variant: "destructive",
          position: "top"
      });
      return false
    }

    if(!validarEmail(form.getValues().email)){
      toast({
          title: "Email Invalido!",
          description: "Coloque um email valido!",
          variant: "destructive",
          position: "top"
      });
      return false
    }

    if(!validarCPF(form.getValues().cpf)){
      toast({
          title: "CPF Invalido!",
          description: "Coloque um CPF valido",
          variant: "destructive",
          position: "top"
      });
      return false
    }

    // if(!validarCpfCadastrado(form.getValues().cpf)){
    //   toast({
    //       title: "CPF Invalido!",
    //       description: "Usuário já cadastrado",
    //       variant: "destructive",
    //       position: "top"
    //   });
    //   return false
    // }

    return true
  }

    const encodeFilters = useCallback(
           (filtros: Partial<usuariosFiltro>) => {
             return {
               ...filtros,
             };
           },
           [filtros]
    );

  const { call: listarUsuarios } = 
    useAsync(async (pagination: PaginationState, filtros:Partial<usuariosFiltro>) => {
      try {
        const encodedFilters = encodeFilters(filtros);
        const response = await UsuarioService.getUsuarios({limit: pagination.pageSize, page: pagination.pageIndex}, encodedFilters)
        setUsuarios(response as any)
        //console.log(encodeFilters)
        //console.log(filtros)
        
      } catch (error) {
        toast({ description: "Não foi possível carregar os usuarios", variant: "erro"});
      }
  }, []);

  const {  call: pesquisarHistorico } = useAsync(async (id: number) => {
    try {
      
      const historicoResponse = await UsuarioService.getHistoricoUsuarioById(id);
      setHistorico(historicoResponse as any)
      

    } catch (error) {
      toast({
        description: "Não foi possível carregar o historico do Usuario",
        variant: "erro",
      });
    }
  }, []);

  useEffect(() => {
      listarUsuarios(pagination, filtros);
    }, [pagination.pageIndex, pagination.pageSize]);

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

  // const { call: listOcupantes } = useAsync(async () => {
  //   try {
  //     const response = await concessionariaService.getOcupantes();
  //     setEmpresas(response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  // useEffect(() => {
  //   listOcupantes();
  // }, [])

  const onSubmit: SubmitHandler<UsuarioFormValues> = async (data) => {
    if(validarFormulario()){
      try {
      
      console.log(form.getValues())

        toast({
          title: "Sucesso!",
          description: "Usuario Editado com sucesso.",
          variant: "sucesso",
          position: "top"
        });
        //form.reset();
        setTimeout(() => {
          handleCancelar()
        }, 1000)
      } catch (error) {
        toast({
          title: "Erro!",
          description: "Não foi possível Editar o usuario.",
          variant: "destructive",
        });
      }
    } else{
        // Efetua o cadastro do usuario
    }
    
  };

  useEffect(() => {
    pesquisar();
  }, []);

  const handleCancelar = useCallback(() => {
      router.push("/admin/usuarios");
  }, []);

  function atualizarUsuario(usuario: UsuarioFormValues){
    form.setValue("nome", usuario.nome)
    form.setValue("email", usuario.email)
    form.setValue("cpf", usuario.cpf)
    form.setValue("telefone", usuario.telefone)
    form.setValue("perfil", usuario.perfil)
    form.setValue("situacao", usuario.situacao)
    form.setValue("empresaOcupante", usuario.empresaOcupante)
    form.setValue("concessionaria", usuario.concessionaria)
    form.setValue("modulos", usuario.modulos)
  }

  const { loading: loading, call: pesquisar } = useAsync(async () => {
      try {
        
        const usuarioResponse = await UsuarioService.getUsuarioById(Number(params.id));
        atualizarUsuario(usuarioResponse as  any)
        
      } catch (error) {
        toast({
          description: "Não foi possível Carregar o Usuario",
          variant: "erro",
        });
      }
    }, []);

  // Renders
  if (loading) {
    return <LoadingSpinner />;
  }

  const RenderFormulario = () => {
    return (
       <>
      <div className="h-[calc(80vh-0px)] bg-greenTertiary text-white px-5 pt-6 rounded-lg mt-5">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="ml-20 h-40 flex gap-10 mb-7 justify-start items-end">
          <Button
              type="submit"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={() => onSubmit(form.getValues()) } //console.log(form.getValues() )
            >
            Salvar
          </Button>
          <Button
              type="button"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={handleCancelar}
            >
              Cancelar
          </Button>
           <Button
              type="button"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={() => {
                pesquisarHistorico(Number(params.id))
                setisModalUsuarioHistoricoOpen(true)
              }  }
            >
              Historico
            </Button>
          </div>
          <Separator />
          <div className="flex flex-row gap-10 mt-10">
            <div className="flex gap-10 w-full">
              <div className="flex-col gap-10" >
                <div className="" >
                  <label
                    htmlFor="nome"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[25%] rounded-lg"
                  >
                    Nome
                  </label>
                  <input 
                    type="text"
                    {...form.register("nome", { valueAsNumber: false })}
                    id="nome"
                    className="text-black p-2 rounded-md w-96"
                    placeholder="Digite seu nome completo"
                    style={{ backgroundColor: white }}
                  />
                </div>

                <div className="my-4" >
                  <label
                    htmlFor="email"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[25%] rounded-lg"
                  >
                    Email
                  </label>
                  <input 
                    type="email"
                    {...form.register("email", { valueAsNumber: false })}
                    id="email"
                    className="text-black p-2 rounded-md w-60"
                    placeholder="seu_email@exemplo.com"
                    style={{ backgroundColor: white }}
                  />
                </div>

                <div className="" >
                  <label
                    htmlFor="empresaOcupante"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[25%] rounded-lg"
                  >
                    Empresa
                  </label>
                  <select
                    {...form.register("empresaOcupante", { valueAsNumber: false })}
                    id="empresaOcupante"
                    className="text-black p-2 rounded-md w-96"
                    style={{ backgroundColor: white }}
                  >
                    <option className="hidden" value="">Selecione</option> 
                    {empresas.map((empresa : any ) => (
                      <option key={empresa.empresa} value={empresa.empresa}> {empresa.empresa} </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex-col gap-10" >

                <div className="" >
                  <label
                    htmlFor="cpf"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[20%] rounded-lg"
                  >
                    CPF
                  </label>
                  <input 
                    type="text"
                    {...form.register("cpf", { valueAsNumber: false })}
                    id="cpf"
                    maxLength={14}
                    className="text-black p-2 rounded-md w-40"
                    placeholder="000.000.000-00"
                    style={{ backgroundColor: white }}
                    onChange={(e) => {
                      handleChange(e)
                    }}
                  />
                </div>

                <div className="my-4" >
                  <label
                    htmlFor="telefone"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[30%] rounded-lg"
                  >
                    Telefone
                  </label>
                  <input 
                    type="text"
                    {...form.register("telefone", { valueAsNumber: false })}
                    id="telefone"
                    className="text-black p-2 rounded-md w-40"
                    maxLength={14}
                    placeholder="(XX)XXXXX  -XXXX"
                    style={{ backgroundColor: white }}
                    onChange={(e) => {
                      handleChangeTelefone(e)
                    }}
                  />
                </div>

                <div className="" >
                  <label
                    htmlFor="concessionaria"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[50%] rounded-lg"
                  >
                    Concessionaria
                  </label>
                  <select
                    {...form.register("concessionaria", { valueAsNumber: false })}
                    id="concessionaria"
                    className="text-black p-2 rounded-md w-96"
                    style={{ backgroundColor: white }}
                  >
                    <option className="hidden" value="">Selecione</option> 
                    {concessionarias.map((concessionaria) => (
                      <option key={concessionaria.id} value={concessionaria.nomeFantasia}> {concessionaria.nomeFantasia} </option>
                    ))}
                  </select>
                  
                </div>

              </div>
                
              </div>
            </div>

            <div className="flex gap-10 w-full mt-4">
                 <div className="" >
                  <label
                    htmlFor="perfil"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[90%] rounded-lg"
                  >
                    Perfil de acesso
                  </label>

                   
                  <select
                    {...form.register("perfil", { valueAsNumber: false })}
                    id="perfil"
                    className="text-black p-2 rounded-md w-48"
                    style={{ backgroundColor: white }}
                  >
                    <option className="hidden" value="">Selecione</option> 
                    {mockFiltroPerfil.map((perfil : any) => (
                      <option key={perfil.perfil} value={perfil.perfil}> {perfil.perfil} </option>
                    ))}
                  </select>

                </div>

                 <div className="" >
                  <label
                    htmlFor="modulos"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[50%] rounded-lg"
                  >
                    Modulos
                  </label>
                  <select
                    {...form.register("modulos", { valueAsNumber: false })}
                    id="modulos"
                    className="text-black p-2 rounded-md w-96"
                    style={{ backgroundColor: white }}
                  >
                    <option className="hidden" value="">Selecione</option> 
                    {modulosMock.map((modulo : any) => (
                      <option key={modulo.modulo} value={modulo.modulo}> {modulo.modulo} </option>
                    ))}
                  </select>
                  
                </div>

                 <div className="" >
                  <label
                    htmlFor="situacao"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[50%] rounded-lg"
                  >
                    Situacão
                  </label>
                  
                  <select
                    {...form.register("situacao", { valueAsNumber: false })}
                    id="situacao"
                    className="text-black p-2 rounded-md w-48"
                    style={{ backgroundColor: white }}
                  >
                    <option className="hidden" value="">Selecione</option>
                    <option key={"Ativo"} value={"Ativo"}>Ativo</option>
                    <option key={"Inativo"} value={"Inativo"}>Inativo</option>
                  </select>
                </div>
                
            </div>
        </form>
      </div>
    </>
    )
   
  }

  const RenderModalHistorico = () => {
    return (
      <>
        <HistoricoUsuarioModal
          isOpen={isModalUsuarioHistoricoOpen}
          onClose={() => setisModalUsuarioHistoricoOpen(false)}
          historico={historico as any}
        />
      </>
    )
  }
 
  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Editar de Usuario" description="" />
      {RenderFormulario()}
      {RenderModalHistorico()}
    </>
  );
}

export default EditarUsuario;