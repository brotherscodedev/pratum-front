import BreadCrumb from "@/components/breadcrumb";
import { CreateProfileOne } from "@/components/forms/user-profile-stepper/create-profile";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { NotificacoesBusca } from "./busca";

const breadcrumbItems = [{ title: "Faturamento", link: "/concessionaria/faturamento" }];

const data = [
  { ocupante:'Teste Telecom', municipio: "Maringá", pontos:50000, tipo: "Norma", eqde: ".", valor_eqde: "R$", eqee: ".", valor_eqee: "R$", total: "R$" },
  { ocupante:'Teste Telecom', municipio: "Mandaguari", pontos:50000,tipo: "Resolução" , eqde: ".", valor_eqde: "R$", eqee: ".", valor_eqee: "R$", total: "R$" },
  { ocupante:'Teste Telecom', municipio: "Arapongas", pontos:50000,tipo: "Resolução" , eqde: ".", valor_eqde: "R$", eqee: ".", valor_eqee: "R$", total: "R$" },
  { ocupante:'Teste Telecom', municipio: "Apucarana",pontos:50000, tipo: "Resolução" , eqde: ".", valor_eqde: "R$", eqee: ".", valor_eqee: "R$", total: "R$" },
  { ocupante:'Teste Telecom', municipio: "Jandaia do Sul", pontos:50000,tipo: "Resolução" , eqde: ".", valor_eqde: "R$", eqee: ".", valor_eqee: "R$", total: "R$" },
  { ocupante:'Teste Telecom', municipio: "Marialva", pontos:50000,tipo: "Lei" , eqde: ".", valor_eqde: "R$", eqee: ".", valor_eqee: "R$", total: "R$" },
];

export default function page() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title={"Faturamento"} description={""} />
        <Separator />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full">
        <NotificacoesBusca
            data={data}
            pageNo={1}
            totalUsers={10}
            pageCount={1}
        />
        </div>
      </div>
    </ScrollArea>
  );
}
