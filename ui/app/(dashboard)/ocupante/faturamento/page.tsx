import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems = [{ title: "Faturamento", link: "/ocupante/faturamento" }];

const data = [
  { ocupante:'Teste Telecom' ,municipio: "Maringá", pontos:2579, tipo: "Norma" },
  { ocupante:'Teste Telecom' ,municipio: "Mandaguari", pontos:8532,tipo: "Resolução" },
  { ocupante:'Teste Telecom' ,municipio: "Arapongas", pontos:9520,tipo: "Resolução" },
  { ocupante:'Teste Telecom' ,municipio: "Apucarana",pontos:1801, tipo: "Resolução" },
  { ocupante:'Teste Telecom' ,municipio: "Jandaia do Sul", pontos:9898,tipo: "Resolução" },
  { ocupante:'Teste Telecom' ,municipio: "Marialva", pontos:2321,tipo: "Lei" },
];

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title={"Faturamento"} description={""} />
        <Separator />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

        <Separator />


        </div>
      </div>
    </ScrollArea>
  );
}
