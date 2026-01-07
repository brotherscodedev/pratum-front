"use client";

import { UserTypeAdmin, UserTypeConcessionaria, UserTypeOcupante } from "@/constants/siga";
import PainelOcupante from "./ocupante";
import PainelConcessionaria from "./concessionaria";
import { LoadingSpinner } from "@/components/spinner";
import Header from "@/components/layout/header";
import { useContext } from "react";
import { UsuarioContext } from "@/app/context";
import PainelAdmin from "./admin";

export default function page() {
  const user = useContext(UsuarioContext);

  console.log("painel user:", user)

  switch (user?.type) {
    case UserTypeOcupante:
      return (
        <div className="w-full overflow-clip">
          <Header />
          <div className="h-14 pb-1 w-full bg-whiteSecundary dark:bg-grayPrimary"></div>
          <PainelOcupante />
        </div>
      );
    case UserTypeConcessionaria:
      return (
        <div className="flex">
          <Header />
          <div className="h-14 pb-4 w-full bg-whiteSecundary"></div>
          <PainelConcessionaria />
        </div>
      );

      case UserTypeAdmin:
        return (
          <div className="flex">
            <Header />
            <div className="h-14 pb-4 w-full bg-whiteSecundary"></div>
            <PainelAdmin />
          </div>
        );
    default:
      return <LoadingSpinner />;
  }
}
