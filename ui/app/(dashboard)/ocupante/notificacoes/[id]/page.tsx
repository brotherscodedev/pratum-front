'use client'

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
import useAsync from "@/hooks/useAsync";
import notificacaoService, { NotificacaoResponseType } from "@/services/ocupante/notficacoes-service";
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
  const router = useRouter()
  const { toast } = useToast();
  const [status, setStatus] = useState<string>("");
  const [file, setFile] = useState<FileUploaded>();

  const breadcrumbItems = [
    { title: "Visualizar notificação", link: `/ocupante/notificacoes/${params.id}` },
  ];

  const handleOpenAnexos = async () => {
    if (file) {
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

  useEffect(() => {
    pesquisar();
  }, []);

  const { loading: loading, call: pesquisar } = useAsync(async () => {
    try {
      const notificacaoResponse = await notificacaoService.getNotificacaoById(Number(params.id));

      if (notificacaoResponse) {
        setStatus(notificacaoResponse.status);

        if (notificacaoResponse.arquivos && notificacaoResponse.arquivos.length > 0) {
          setFile({
            key: notificacaoResponse.arquivos[0].key,
            nome: notificacaoResponse.arquivos[0].nome,
            tamanho: notificacaoResponse.arquivos[0].tamanho,
            url: notificacaoResponse.arquivos[0].url,
            id: notificacaoResponse.arquivos[0].id
          })
        }
        //form.setValue("empresaId", notificacaoResponse.empresa.id);
        form.setValue("empresaId", notificacaoResponse.empresa.nomeFantasia);
        //form.setValue("cidadeId", notificacaoResponse.cidade.id);
        form.setValue("cidadeId", notificacaoResponse.cidade.nome);
        //form.setValue("tipoId", notificacaoResponse.tipo.id);
        form.setValue("tipoId", notificacaoResponse.tipo.tipo);
        form.setValue("prazo", notificacaoResponse.prazo);
        form.setValue("maximoInteracoes", notificacaoResponse.maximoInteracoes);
        form.setValue("motivo", notificacaoResponse.motivo);
      }

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a notificação",
        variant: "erro",
        position: "top"
      });
    }
  }, []);

    const handleVoltar = useCallback(() => {
      router.push("/ocupante/notificacoes");
    }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Visualizar notificação" description="" />
      <div className="h-[calc(80vh-0px)] bg-greenTertiary text-white px-5 pt-6 rounded-lg mt-5">
        <form>
          <div className="ml-20 h-40 flex gap-10 mb-7 justify-start items-end">
          <Button
              type="button"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={handleVoltar}
            >
              Voltar
            </Button>
            <Button
              disabled={file?.url !== "" ? false : true}
              type="button"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={() => handleOpenAnexos()}
            >
              Anexo
            </Button>
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
                  className="text-black p-2 rounded-md text-center"
                  style={{ backgroundColor: white }}
                >
                  <option value="">Selecione</option>
                  {ocupanteDados.map((item) => (
                    <option key={item.id} value={item.id}>{item.descricao}</option>
                  ))}
                </select> */}
                <input
                  disabled
                  type="text"
                  {...form.register("empresaId", { valueAsNumber: false })}
                  id="empresaId"
                  className="text-black p-2 rounded-md text-left hover:bg-gray-400"
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
                <input 
                  //disabled={status === "Enviada"}
                  disabled={true}
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
                  className="text-black p-2 rounded-md text-center"
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
                <input 
                  //disabled={status === "Enviada"}
                  disabled={true}
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
                className="text-black p-2 rounded-md text-center"
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
              //disabled={status === "Enviada"}
              disabled={true}
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