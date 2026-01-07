"use client";

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
import ResponderNotificacaoModal from "./responder_notificacao";
import Link from "next/link";

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

const ResponderNotificacao = () => {

  // Variaveis
  const params = useParams();
  const router = useRouter();

  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [historico, setHistorico] = useState<any[]>([])
  const [file, setFile] = useState<FileUploaded>();
  const [ableResponse, setAbleResponse] = useState<boolean>(false)
  const [notificacao, setNotificacao] = useState<NotificacaoResponseType | null>(null);

  const breadcrumbItems = [
    {
      title: "Responder notificação",
      link: `/ocupante/notificacoes/responder/${params.id}`,
    },
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
      status: undefined,
    },
  });

  // Funcoes
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

      // await notificacaoService.putNotificacoes(params.id, payload);
      toast({
        title: "Sucesso!",
        description: "Notificação enviada com sucesso.",
        variant: "erro",
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

  const handleVoltar = useCallback(() => {
    router.push("/ocupante/notificacoes");
  }, []);

  const handleNavigateByAnexo = useCallback(() => {
    router.push(file?.url as any);
  }, []);

  useEffect(() => {
    pesquisar();
  }, []);

  const handleOpenModal = async () => {
      const historicoResponse = await notificacaoService.getHistoricoInteracoes(+params.id)
      setHistorico(historicoResponse);
    setIsModalOpen(true);
  };

  const handleOpenAnexos = async () => {
    if (file && file.url !== "") {
      //handleNavigateByAnexo()
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitResposta = async (resposta: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const { loading: loading, call: pesquisar } = useAsync(async () => {
    try {
      const notificacaoResponse = await notificacaoService.getNotificacaoById(
        Number(params.id)
      ) as any;

      setAbleResponse(notificacaoResponse?.tipo.permiteInteracao )

      const historicoResponse = await notificacaoService.getHistoricoInteracoes(+params.id)
      //console.log('DD', historicoResponse)
      //console.log(notificacaoResponse)
      setNotificacao(notificacaoResponse);
      setStatus(notificacaoResponse.status);
      setHistorico(historicoResponse)

      setFile({
        key: notificacaoResponse.arquivos[0].key,
        nome: notificacaoResponse.arquivos[0].nome,
        tamanho: notificacaoResponse.arquivos[0].tamanho,
        url: notificacaoResponse.arquivos[0].url,
        id: notificacaoResponse.arquivos[0].id,
      });
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

  // Renders
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <Heading title="Responder notificação" description="" />
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
            <Button
              disabled={file?.url !== "" ? false : true}
              type="button"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={() => handleOpenAnexos()}
            >
              Anexo
            </Button>
            <Button
              type="button"
              className="bg-white text-black w-40 hover:bg-gray-400"
              onClick={handleOpenModal}
              disabled={!ableResponse}
            >
              Responder
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
                {/* <select
                  disabled
                  {...form.register("empresaId", { valueAsNumber: true })}
                  id="empresaId"
                  className="text-black p-2 rounded-md text-center"
                  style={{ backgroundColor: white }}
                >
                  <option value="">Selecione</option>
                  { notificacao ?
                    <option key={notificacao.empresa.id} value={notificacao.empresa.id}>
                      {notificacao.empresa.nomeFantasia}
                    </option>
                  : null}
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
                  disabled
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
                {/* <select
                  disabled
                  {...form.register("cidadeId", { valueAsNumber: true })}
                  id="cidadeId"
                  className="text-black p-2 rounded-md text-center"
                  style={{ backgroundColor: white }}
                >
                  <option value="">Selecione</option>
                  {notificacao ?
                    <option key={notificacao.cidade.id} value={notificacao.cidade.id}>
                      {notificacao.cidade.nome}
                    </option>
                  : null}
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
                  disabled
                  type="number"
                  {...form.register("maximoInteracoes", {
                    valueAsNumber: true,
                  })}
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

              {/* <select
                disabled
                {...form.register("tipoId", { valueAsNumber: true })}
                id="tipoId"
                className="text-black p-2 rounded-md text-center"
                style={{ backgroundColor: "white" }}
              >
                <option value="">Selecione</option>
                {notificacao ?
                  <option key={notificacao.tipo.id} value={notificacao.tipo.id}>
                    {notificacao.tipo.tipo}
                  </option>
                : null}
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
      <ResponderNotificacaoModal
        isOpen={isModalOpen}
        notificacaoId={+params.id}
        onClose={handleCloseModal}
        onSubmit={handleSubmitResposta}
        historico={historico}
        habilitaResponder={true}
      />
    </>
  );
};

export default ResponderNotificacao;
