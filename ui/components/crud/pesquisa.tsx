"use client";
import { ReactNode, FC } from "react";
import BreadCrumb from "../breadcrumb";
import { Heading } from "../ui/heading";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

type PesquisaPropsType = {
  titulo: string;
  breadcrumbItems: { title: string; link: string }[];
  botoes?: ReactNode;
  grid: ReactNode;
  filtros: ReactNode;
}

export const Pesquisa: FC<PesquisaPropsType> = ({
  breadcrumbItems,
  titulo,
  botoes,
  grid,
  filtros,
}) => {
  return (
    <ScrollArea className="h-full w-full ">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-4 ">
          <Heading title={titulo} description={""} />
          <div className="flex grow justify-end space-x-4 ">{botoes}</div>
        </div>
        <Separator />
        <div className="flex items-left justify-between w-full ">
          <div className="flex items-center space-x-4 flex-1 ">{filtros}</div>
        </div>
        <div className="flex-1 items-left justify-between w-full ">{grid}</div>
      </div>
    </ScrollArea>
  );
};
