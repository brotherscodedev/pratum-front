import BreadCrumb from "@/components/breadcrumb";
import { CreateProfileOne } from "@/components/forms/user-profile-stepper/create-profile";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const breadcrumbItems = [
  { title: "Inventario de Postes", link: "/ocupante/inventario" },
];

const data = [
  { nome: "Faturamento", tipo: "" },
  { nome: "Pontos", tipo: "" },
  { nome: "Multas", tipo: "" },
  { nome: "Notificações", tipo: "" },
];

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title={"Inventario de Postes"} description={""} />
        <Separator />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2"></div>
        </div>
      </div>
    </ScrollArea>
  );
}
