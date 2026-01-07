"use client";

import Sidebar from "@/components/layout/sidebar";
import { UsuarioContext } from "../context";
import { LoadingSpinner } from "@/components/spinner";
import { useEffect, useState } from "react";
import usuarioService from "@/services/usuario-service";
import useAsync from "@/hooks/useAsync";
import { Usuario } from "@/types";
import { VERSION } from "@/constants/version";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<Usuario | null>(null);
  const vesion = VERSION;
  const { call: buscarUsuario } = useAsync(async () => {
    try {
      const response = await usuarioService.getUsuarioLogado();
      setUser(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    buscarUsuario();
    console.log(
      `Versão do aplicativo: v${vesion}`)
  }, [buscarUsuario]);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <UsuarioContext.Provider value={user}>
        <div className="flex h-screen overflow-hidden dark:bg-grayPrimary">
          <Sidebar />
          <main className="w-full p-8 max-h-full ">{children}</main>
        </div>
      </UsuarioContext.Provider>
    </>
  );
}
