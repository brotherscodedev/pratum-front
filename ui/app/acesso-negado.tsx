"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function AcessoNegado() {
  const router = useRouter();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-16 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        Acesso Negado!
      </span>
      <h2 className="my-2 font-heading text-2xl font-bold">
        Algo deu errado
      </h2>
      <p>
        Desculpe, seu usuário não tem permissão para acessar este recurso.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Voltar
        </Button>
        <Button
          onClick={() => router.push("/painel")}
          variant="ghost"
          size="lg"
        >
          Ir para o inicio
        </Button>
      </div>
    </div>
  );
}
