"use client";
import { UsuarioContext } from "@/app/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useCallback, useContext } from "react";

export function UserNav() {
  const router = useRouter();

  const sair = () => {
    // TODO: comentado porque o signOut não está funcionando está dando erro ao invocar o backend.
    // signOut();
    console.log("ENTROU!!!");
    router.push("/");
    setTimeout(() => {
      router.refresh()
    }, 1000)
  };

  const irPerfil = useCallback(() => {
    router.push("/profile");
  }, []);

  const user = useContext(UsuarioContext);
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-12 w-12 justify-center items-center bg-greenTertiary rounded-md dark:bg-greenGray"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={""} alt={user?.name ?? ""} />
              <AvatarFallback className="text-whiteSecundary bg-transparent text-2xl">
                {user?.name?.[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 flex flex-col justify-center bg-greenTertiary rounded-md text-whiteSecundary dark:bg-greenGray"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => irPerfil()}>
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => sair()}
            className="hover:bg-redPrimary"
          >
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
