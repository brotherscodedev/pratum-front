import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems = [{ title: "Atualização de Projetos", link: "/concessionaria/atualizacao-projetos" }];

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title={"Atualização de Projetos"} description={""} />
        <Separator />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          
        </div>
      </div>
    </ScrollArea>
  );
}
