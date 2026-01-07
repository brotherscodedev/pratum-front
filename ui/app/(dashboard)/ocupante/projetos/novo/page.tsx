"use client";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useToast } from "@/components/ui/use-toast";
import { useApiGet } from "@/hooks/useApi";
import useAsync from "@/hooks/useAsync";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import ProjetoForm from "./form";
import { BasicResponseType } from "@/services/http";
import projetoService from "@/services/projeto-service";

const breadcrumbItems = [
  { title: "Projetos", link: "/ocupante/projetos" },
  { title: "Novo", link: "/ocupante/projetos/novo" },
];

const formSchema = z.object({
  descricao: z.string().trim().min(1, "Informe a descrição do projeto"),
  cidadeId: z.string({ required_error: "Informe a cidade" }),
});

export type FormProjetoValuesType = z.infer<typeof formSchema>;

export default function page() {
  const { toast } = useToast();
  const router = useRouter();

  const { result: cidades } = useApiGet<BasicResponseType[]>({
    uri: "geral/cidades",
  });

  const form = useForm<FormProjetoValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { call: save } = useAsync(
    (data: FormProjetoValuesType) => {
      const body = { ...data, cidadeId: Number(data.cidadeId) };

      projetoService
        .createProjeto(body)
        .then((projeto) => {
          toast({ 
            title: "Sucesso",
            description: "Projeto criado com sucesso.",
            variant: "sucesso",
            position: "top" 
          });
          router.push(`/ocupante/projetos/${projeto.id}`);
        })
        .catch((e) => {
          console.error(e);
          toast({ 
            title: "Erro",
            description: "Erro ao salvar o projeto." ,
            variant: "erro",
            position: "top"
          });
        });
    },
    []
  );

  const onSubmit: SubmitHandler<FormProjetoValuesType> = (formValues) => {
    save(formValues);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title={"Novo Projeto"} description={""} />
        <Separator />
        <div className="w-300 h-300">
          <ProjetoForm
            cidades={cidades || []}
            onSubmit={onSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
