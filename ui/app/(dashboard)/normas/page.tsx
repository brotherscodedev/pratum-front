"use client";

import { UsuarioContext } from "@/app/context";
import BreadCrumb from "@/components/breadcrumb";
import { ModalForm } from "@/components/crud/modalForm";
import BotaoUpload, { FileUploaded } from "@/components/crud/upload";
import { Icons } from "@/components/icons";
import { LoadingSpinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { UserTypeConcessionaria } from "@/constants/siga";
import { callApi, useApiGet } from "@/hooks/useApi";
import { Documento } from "@/types";
import Link from "next/link";
import React, { useContext } from "react";

const breadcrumbItems = [{ title: "Normas e Resoluções", link: "/normas" }];

const formModal = ({ valores, setValores }: any) => (
  <div className="grid gap-4 py-4">
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="nome" className="text-right">
        Nome
      </Label>
      <Input
        id="nome"
        className="col-span-3"
        value={valores.nome}
        onChange={(e) => setValores({ ...valores, nome: e.target.value })}
      />
    </div>
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="tipo" className="text-right">
        Tipo
      </Label>
      <Select
        value={valores?.cidadeId}
        onValueChange={(value) => setValores({ ...valores, tipo: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"Norma"}>Norma</SelectItem>
          <SelectItem value={"Resolução"}>Resolução</SelectItem>
          <SelectItem value={"Lei"}>Lei</SelectItem>
          <SelectItem value={"Outros"}>Outros</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Separator />
    <div className="grid grid-cols-4 items-center gap-4 ml-10">
      <BotaoUpload
        onUpload={(file: FileUploaded) =>
          setValores({ ...valores, arquivo: file })
        }
      />
    </div>
  </div>
);

export default function page() {
  const user = useContext(UsuarioContext);

  const isConcessionaria =
    user?.type === UserTypeConcessionaria;

  const { toast } = useToast();
  const [pesquisar, setPesquisar] = React.useState(false);

  const { result, loading } = useApiGet<Documento[]>({
    uri: "geral/documentos",
    dependencyList: [pesquisar],
  });

  const [valores, setValores] = React.useState({} as Documento);

  const podeGravar =
    valores.nome != null &&
    valores.tipo != null &&
    valores.arquivo != null;

  console.log("podeGravar", podeGravar);
  const onSubmit = async () => {
    const res = await callApi({
      uri: "concessionaria/documento",
      body: { ...valores },
    });

    if (!res?.success) {
      toast({
        title: "Erro",
        description: res?.message,
        variant: "erro",
        position: "top"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: res?.message,
      variant: "sucesso",
      position: "top"
    });
    setPesquisar(!pesquisar);
  };

  const remover = async (item: Documento) => {
    const res = await callApi({
      uri: "concessionaria/documento/" + item.id,
      method: "DELETE",
    });

    if (!res?.success) {
      toast({
        title: "Erro",
        description: res?.message,
        variant: "erro",
        position: "top"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: res?.message,
      variant: "sucesso",
      position: "top"
    });
    setPesquisar(!pesquisar);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title={"Normas e Documentos"} description={""} />
        {isConcessionaria && (
          <div className="flex grow justify-end space-x-4">
            <ModalForm
              titulo="Novo Documento"
              descricao="Adicione um novo documento ao sistema"
              onSubmit={onSubmit}
              onCancel={() => {}}
              triggerButton={<Button>Novo Documento</Button>}
              form={formModal({ valores, setValores })}
              gravarHabilitado={podeGravar}
            />
          </div>
        )}
        <Separator />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2"></div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {result?.map((item) => (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {item.tipo}
                      </CardTitle>
                      {isConcessionaria && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Remover Documento"
                            >
                              <Icons.trash />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">
                                  {`Confirma a remoção do documento ${item.nome}?`}
                                </h4>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    remover(item);
                                  }}
                                >
                                  Remover
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        <Link target="_blank" href={item.arquivo.url}>
                          {item.nome}
                        </Link>
                      </div>
                      <p className="text-xs text-muted-foreground"></p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ScrollArea>
  );
}
