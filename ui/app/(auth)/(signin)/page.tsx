'use client';
import UserAuthForm from "@/components/forms/user-auth-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import iLogoHorizontal from "@/app/src/assets/icons/iLogoHorizontal";
import React, { useCallback } from "react";

// export const metadata: Metadata = {
//   title: "SIGA - Login",
//   description: "",
// };

export default function AuthenticationPage() {
  const router = useRouter();
  const handleTelaInicio = useCallback(() => {
    router.push("/");
  }, []);
  const params = useSearchParams();
  const { toast } = useToast();
  const [showToast, setShowToast] = React.useState(false);
  if (!showToast && params.get("error") === "CredentialsSignin") {
    setShowToast(true);
    toast({
      title: "Erro de autenticação",
      description: "Email ou senha inválidos",
      variant: "erro",
      position: "top"
    });
    setTimeout(() => {
      handleTelaInicio()
    }, 1000)
  }

  return (
    <>
    <div className="flex h-screen w-screen px-16 justify-between backgroundImage">
      <div className="w-48 h-screen backgroundPattern"/>
      <div className="flex justify-end items-center h-screen">
        <div className="py-20 px-16 h-max w-max flex flex-col content-center items-center bg-greenTertiary rounded-default">
          <div className="mb-10">
            {iLogoHorizontal()}
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
    <Toaster />
    </>
  );
}
