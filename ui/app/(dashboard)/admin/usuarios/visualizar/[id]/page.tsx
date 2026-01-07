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
import UsuarioService from "@/services/admin-service/usuario";
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

const VisualizarUsuario = () => {
  
  // Variaveis e constantes
  const params = useParams()
   
  const { toast } = useToast();
  const router = useRouter();
  const [isModalUsuarioHistoricoOpen, setisModalUsuarioHistoricoOpen] = useState(false)
  const [historico, setHistorico] = useState([])

  const breadcrumbItems = [
    { title: "Usuarios", link: `/admin/usuarios` },
    { title: "Visualizar Usuario", link: `/admin/usuarios/visualizar/${params.id}` },
  ];

  const form = useForm<UsuarioFormValues>({
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
    pesquisar();
  }, []);

  const handleVoltar = useCallback(() => {
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
        description: "Não foi possível carregar o Usuario",
        variant: "erro",
      });
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Renders
  const RenderFormulario = () => {
    return (
      <>
        <BreadCrumb items={breadcrumbItems} />
      <Heading title="Visualizar Usuario" description="" />
      <div className="h-[calc(80vh-0px)] bg-greenTertiary text-white px-5 pt-6 rounded-lg mt-5">
        {/* <form onSubmit={() => console.log("Não manda o formulario")}> */}
          <div className="ml-20 h-40 flex gap-10 mb-7 justify-start items-end">
          <Button
              type="button"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={handleVoltar}
            >
              Voltar
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
            {/* <div className="flex flex-col gap-9"> */}
            <div className="flex gap-10 w-full">
              <div className="flex-col gap-10" >
                <div className="" >
                  <label
                    htmlFor="prazo"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[25%] rounded-lg"
                  >
                    Nome
                  </label>
                  <input disabled={true}
                    type="text"
                    {...form.register("nome", { valueAsNumber: false })}
                    id="nome"
                    className="text-black p-2 rounded-md w-96"
                    placeholder="Nome"
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
                  <input disabled={true}
                    type="text"
                    {...form.register("email", { valueAsNumber: false })}
                    id="email"
                    className="text-black p-2 rounded-md w-60"
                    placeholder="email@teste.com"
                    style={{ backgroundColor: white }}
                  />
                </div>

                <div className="" >
                  <label
                    htmlFor="empresa"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[25%] rounded-lg"
                  >
                    Empresa
                  </label>
                  <input disabled={true}
                    type="text"
                    {...form.register("empresaOcupante", { valueAsNumber: false })}
                    id="empresa"
                    className="text-black p-2 rounded-md w-96"
                    placeholder="email@teste.com"
                    style={{ backgroundColor: white }}
                  />
                </div>
              </div>
              
              <div className="flex-col gap-10" >

                <div className="" >
                  <label
                    htmlFor="prazo"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[20%] rounded-lg"
                  >
                    CPF
                  </label>
                  <input disabled={true}
                    type="text"
                    {...form.register("cpf", { valueAsNumber: false })}
                    id="cpf"
                    className="text-black p-2 rounded-md w-40"
                    placeholder="Nome"
                    style={{ backgroundColor: white }}
                  />
                </div>

                <div className="my-4" >
                  <label
                    htmlFor="telefone"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[30%] rounded-lg"
                  >
                    Telefone
                  </label>
                  <input disabled={true}
                    type="text"
                    {...form.register("telefone", { valueAsNumber: false })}
                    id="telefone"
                    className="text-black p-2 rounded-md w-40"
                    placeholder="(99)99999-9999"
                    style={{ backgroundColor: white }}
                  />
                </div>

                <div className="" >
                  <label
                    htmlFor="telefone"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[50%] rounded-lg"
                  >
                    Concessionaria
                  </label>
                  <input disabled={true}
                    type="text"
                    {...form.register("concessionaria", { valueAsNumber: false })}
                    id="concessionaria"
                    className="text-black p-2 rounded-md w-96"
                    placeholder=""
                    style={{ backgroundColor: white }}
                  />
                </div>

              </div>
                
              </div>
            </div>

            <div className="flex gap-10 w-full mt-4">
                 <div className="" >
                  <label
                    htmlFor="empresa"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[60%] rounded-lg"
                  >
                    Perfil de acesso
                  </label>
                  <input disabled={true}
                    type="text"
                    {...form.register("perfil", { valueAsNumber: false })}
                    id="perfil"
                    className="text-black p-2 rounded-md w-96"
                    placeholder="perfil de acesso..."
                    style={{ backgroundColor: white }}
                  />
                </div>

                 <div className="" >
                  <label
                    htmlFor="empresa"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[25%] rounded-lg"
                  >
                    Modulos
                  </label>
                  <input disabled={true}
                    type="text"
                    {...form.register("modulos", { valueAsNumber: false })}
                    id="empresa"
                    className="text-black p-2 rounded-md w-96"
                    placeholder="modulos"
                    style={{ backgroundColor: white }}
                  />
                </div>

                 <div className="" >
                  <label
                    htmlFor="empresa"
                    className="block text-sm mb-4 bg-customTeal p-2 w-[25%] rounded-lg"
                  >
                    Situacão
                  </label>
                  <input disabled={true}
                    type="text"
                    {...form.register("situacao", { valueAsNumber: false })}
                    id="situacao"
                    className="text-black p-2 rounded-md w-96"
                    placeholder="Ativo ou Inativo"
                    style={{ backgroundColor: white }}
                  />
                </div>
                
                
            </div>
          {/* </div> */}
          
        {/* </form> */}
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
      {RenderModalHistorico()}
      {RenderFormulario()}
    </>
  );
}

export default VisualizarUsuario;