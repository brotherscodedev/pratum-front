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
import { FileUploaded } from "@/components/crud/upload";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import notificacaoService from "@/services/concessionaria/notificacao-service";
import useAsync from "@/hooks/useAsync";
import { NotificacaoResponseType } from "@/services/ocupante/notficacoes-service";
import { LoadingSpinner } from "@/components/spinner";
import { useRouter } from "next/navigation";



const formSchema = z.object({
   //empresaId: z.number().min(1, "Selecione a empresa").max(365),
  empresaId: z.string(),
  //cidadeId: z.number().min(1, "Selecione a cidade").max(365),
  cidadeId: z.string(),
  //tipoId: z.number().min(1, "Selecione um tipo").max(365),
  tipoId: z.string(),
  prazo: z.number().min(1, "Prazo deve ser maior que 0").max(365),
  maximoInteracoes: z
    .number()
    .min(1, "Quantidade deve ser maior que 0")
    .max(100),
  motivo: z.string().optional(),
  status: z.string().optional(),
});

type NotificacaoFormValues = z.infer<typeof formSchema>;

const AtualizarNotificacao = () => {
  const params = useParams()
  
  
  const { toast } = useToast();
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const [file, setFile] = useState<FileUploaded>();
  const [enviarNotificacao, setEnviarNotificacao] = useState<boolean>(false);

  const breadcrumbItems = [
    { title: "Visualizar Notificação", link: `/concessionaria/notificacoes/${params.id}` },
  ];

  const form = useForm<NotificacaoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresaId: undefined,
      cidadeId: undefined,
      tipoId: undefined,
      prazo: undefined,
      maximoInteracoes: undefined,
      motivo: undefined,
      status: undefined
    },
  });

  // const tipos = [
  //   {
  //     "id": 1,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Conclusão de inventário",
  //     "permiteInteracao": true,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 2,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Início de inventário",
  //     "permiteInteracao": true,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 3,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Irregularidades técnicas",
  //     "permiteInteracao": true,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 4,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Parecer da defesa de inventário",
  //     "permiteInteracao": true,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 5,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Postes à revelia",
  //     "permiteInteracao": true,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 6,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Projeto de regularização",
  //     "permiteInteracao": true,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 7,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Relação contratual",
  //     "permiteInteracao": true,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 8,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Risco imediato",
  //     "permiteInteracao": true,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 9,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Solicitação de documentos",
  //     "permiteInteracao": true,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 10,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Avisos diversos",
  //     "permiteInteracao": false,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 11,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Obras na rede",
  //     "permiteInteracao": false,
  //     "valoresPadrao": null
  //   },
  //   {
  //     "id": 12,
  //     "updatedAt": "0001-01-01T00:00:00Z",
  //     "createdAt": "0001-01-01T00:00:00Z",
  //     "tipo": "Vistorias programadas",
  //     "permiteInteracao": false,
  //     "valoresPadrao": null
  //   }
  // ]


  const onSubmit: SubmitHandler<NotificacaoFormValues> = async (data) => {
    try {
      const payload = {
        ...data,
        status,
        arquivos: [
          {
            id: file?.id ?? 0,
            nome: file?.nome || "",
            tamanho: file?.tamanho || 0,
            key: file?.key || "",
            url: file?.url || "",
          },
        ],
      };

      if (!params.id) {
        throw new Error("ID da notificação é obrigatório.");
      }

      if(enviarNotificacao){
        await notificacaoService.enviaNotificacao(params.id);
      } else {
        await notificacaoService.putNotificacoes(params.id, payload);
      }


      toast({
        title: "Sucesso!",
        description: "Notificação enviada com sucesso.",
        variant: "sucesso",
        position: "top"
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível enviar a notificação.",
        variant: "destructive",
        position: "top"
      });
    }
  };

  useEffect(() => {
    pesquisar();
  }, []);

  const handleVoltar = useCallback(() => {
      router.push("/concessionaria/notificacoes");
  }, []);

  const { loading: loading, call: pesquisar } = useAsync(async () => {
    try {
      const notificacaoResponse = await notificacaoService.getNotificacaoById(Number(params.id));

      if (!notificacaoResponse) {
        toast({
          title: "Erro",
          description: "Notificação não encontrada",
          variant: "erro",
          position: "top"
        });
        return;
      }

      setStatus(notificacaoResponse.status);

      setFile({
        key: notificacaoResponse.arquivos[0].key,
        nome: notificacaoResponse.arquivos[0].nome,
        tamanho: notificacaoResponse.arquivos[0].tamanho,
        url: notificacaoResponse.arquivos[0].url,
        id: notificacaoResponse.arquivos[0].id
      })
       //form.setValue("empresaId", notificacaoResponse.empresa.id);
      form.setValue("empresaId", notificacaoResponse.empresa.nomeFantasia);
      //form.setValue("cidadeId", notificacaoResponse.cidade.id);
      form.setValue("cidadeId", notificacaoResponse.cidade.nome);
      //form.setValue("tipoId", notificacaoResponse.tipo.id);
      form.setValue("tipoId", notificacaoResponse?.tipo.tipo);
      form.setValue("prazo", notificacaoResponse.prazo);
      form.setValue("maximoInteracoes", notificacaoResponse.maximoInteracoes);
      form.setValue("motivo", notificacaoResponse.motivo);

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a notificação",
        variant: "erro",
        position: "top"
      });
    }
  }, []);

  const handleOpenAnexos = async () => {
   if (file && file.url !== "") {
     window.open(file.url, "_blank");
   } else {
    toast({
      title: "Erro!",
      description: "Não foi possível visualuzar o anexo.",
      variant: "destructive",
      position: "top"
    });
   }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Visualizar Notificação" description="" />
      <div className="h-[calc(80vh-0px)] bg-greenTertiary text-white px-5 pt-6 rounded-lg mt-5">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="ml-20 h-40 flex gap-10 mb-7 justify-start items-end">
          <Button
              type="button"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={handleVoltar}
            >
              Voltar
            </Button>
            {/* <UploadButton<OurFileRouter>
              appearance={{
                button:
                  "bg-white text-black w-40 hover:bg-gray-400",
                container:
                  "w-max flex-row rounded-md border-cyan-300 bg-slate-800",
                allowedContent:
                  "flex h-8 flex-col items-center jusFtify-center px-2 text-white hidden",
              }}
              content={{ button: <span className="z-50">Anexar</span> }}
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (!res) {
                  toast({
                    title: "Upload",
                    description: "Erro ao enviar o arquivo!",
                    variant: "erro",
                    position: "top"
                  });
                  return;
                }

                toast({
                  title: "Upload",
                  description: "Arquivo enviado com sucesso!",
                  variant: "sucesso",
                  position: "top"
                });
                const file = res[0];
                const fileUploaded: FileUploaded = {
                  nome: file?.name,
                  tamanho: file?.size,
                  key: file?.key,
                  url: file?.url,
                };

                setFile(fileUploaded);
              }}
              onUploadError={(error: Error) => {
                console.log("Error: ", error);
                toast({
                  title: "Error",
                  variant: "erro",
                  description: error.message,
                  position: "top"
                });
              }}
            /> */}
            <Button
              disabled={file?.url !== "" ? false : true}
              type="button"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={() => handleOpenAnexos()}
            >
              Anexo
            </Button> 
            {/* <Button
              type="submit"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={() => setStatus("Rascunho")}
            >
              Salvar Rascunho
            </Button>
            <Button
              type="submit"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={() => {setEnviarNotificacao(true)}}
            >
              Enviar notificação
            </Button> */}
          </div>
          <Separator />
          <div className="flex flex-row gap-10 mt-10">
            <div className="flex flex-col gap-9">
              <div className="flex flex-col w-96">
                <label
                  htmlFor="empresaId"
                  className="text-sm mb-4 bg-customTeal p-2 w-[40%] rounded-lg"
                >
                  Empresa Ocupante
                </label>
                {/* <select disabled={status === "Enviada"}
                  {...form.register("empresaId", { valueAsNumber: true })}
                  id="empresaId"
                  className="text-black p-2 rounded-md text-left"
                  style={{ backgroundColor: white }}
                >
                  <option value="hidden">Selecione</option>
                  {ocupanteDados.map((item) => (
                    <option key={item.id} value={item.id}>{item.descricao}</option>
                  ))}
                </select> */}
                <input
                  disabled
                  type="text"
                  {...form.register("empresaId", { valueAsNumber: false })}
                  id="empresaId"
                  className="text-black p-2 rounded-md text-left"
                  style={{ backgroundColor: white }}
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="prazo"
                  className="text-sm mb-4 bg-customTeal p-2 w-[60%] rounded-lg"
                >
                  Prazo de Atendimento
                </label>
                <input disabled
                  type="number"
                  {...form.register("prazo", { valueAsNumber: true })}
                  id="prazo"
                  className="text-black p-2 rounded-md w-20"
                  placeholder="Dias"
                  style={{ backgroundColor: white }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-9">
              <div className="flex flex-col w-96">
                <label
                  htmlFor="cidadeId"
                  className="text-sm mb-4 bg-customTeal p-2 w-[40%] rounded-lg"
                >
                  Município
                </label>
                {/* <select disabled={status === "Enviada"} 
                  {...form.register("cidadeId", { valueAsNumber: true })}
                  id="cidadeId"
                  className="text-black p-2 rounded-md text-left"
                  style={{ backgroundColor: white }}
                >
                  <option value="">Selecione</option>
                  {municipioDados.map((item) => (
                    <option key={item.id} value={item.id}>{item.descricao}</option>
                  ))}
                </select> */}
                 <input
                  disabled
                  type="text"
                  {...form.register("cidadeId", { valueAsNumber: false })}
                  id="cidadeId"
                  className="text-black p-2 rounded-md text-left"
                  style={{ backgroundColor: white }}
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="maximoInteracoes"
                  className="text-sm mb-4 bg-customTeal p-2 w-[65%] rounded-lg"
                >
                  Quantidade de Interações
                </label>
                <input disabled
                  type="number"
                  {...form.register("maximoInteracoes", { valueAsNumber: true })}
                  id="maximoInteracoes"
                  className="text-black p-2 rounded-md w-20"
                  style={{ backgroundColor: white }}
                />
              </div>
            </div>
            <div className="flex flex-col w-96">
              <label
                htmlFor="tipoId"
                className="text-sm mb-4 bg-customTeal p-2 w-[40%] rounded-lg"
              >
                Tipo de Notificação
              </label>
              {/* <select disabled={status === "Enviada"}
                {...form.register("tipoId", { valueAsNumber: true })}
                id="tipoId"
                className="text-black p-2 rounded-md text-left"
                style={{ backgroundColor: "white" }}
              >
                <option value="">Selecione</option>
                {tipos.map((item) => (
                  <option key={item.id} value={item.id}>{item.tipo}</option>
                ))}
              </select> */}
              <input
                disabled
                type="text"
                {...form.register("tipoId", { valueAsNumber: false })}
                id="tipoId"
                className="text-black p-2 rounded-md text-left"
                style={{ backgroundColor: white }}
              />
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <label
              htmlFor="motivo"
              className="text-sm mb-4 bg-customTeal p-2 w-[10%] rounded-lg"
            >
              Observação Técnica
            </label>
            <textarea 
              disabled
              {...form.register("motivo")}
              id="motivo"
              className="text-black p-2 rounded-md w-[50%]"
              rows={5}
              style={{ backgroundColor: white }}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default AtualizarNotificacao;