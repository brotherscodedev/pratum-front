"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { UsuarioContext } from "@/app/context";
import { toast, useToast } from "./ui/use-toast";
import notificacaoService from "@/services/ocupante/notficacoes-service";
import { MeuContexto } from "@/app/MeuContexto";
//import notificacaoService from "@/services/concessionaria/notificacao-service";

interface DashboardNavProps {
  items: NavItem[];
  expand: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, expand, setOpen }: DashboardNavProps) {
  const path = usePathname();
  const router = useRouter();
  const user = useContext(UsuarioContext);
  const meuContexto = useContext(MeuContexto);
  const { bloqueioMenu, setBloqueioMenu } = meuContexto || { bloqueioMenu: false, setBloqueioMenu: () => {} };
  const { toast, dismiss } = useToast();
  const [blockMenu, setBlockMenu] = useState(true);
  const [toastId, setToastId] = useState<string | null>(null);


  if (!items?.length) {
    return null;
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      console.log("user:", path);
      if (user?.type === "concessionaria"){
        //setBlockMenu(false)
        setBloqueioMenu(false)
      }
      if (user?.type === "ocupante" && path === "/painel") {
       
        let toastId: any = undefined
        try {
          const response = await notificacaoService.getNotificacoes(
            { page: 1, limit: 20 }
          );
          console.log(response)
          let existeNaoLida = false;
          if (Array.isArray(response)) {
            existeNaoLida = false;
          } else {
            existeNaoLida = response?.existeNaoLida || false;
          }
          // const auxNotificacoes = response.data
          // let auxCount = 0;
          // for (let index = 0; index < auxNotificacoes.length; index++) {
          //   if(auxNotificacoes[index].status === "Enviada") {
          //     setBlockMenu(true)
          //     console.log("Bloqueou o menu")
          //   } else {
          //     ++auxCount
          //   }
          // }
         
          //console.log(auxCount,auxNotificacoes)
          // if(auxNotificacoes.length === auxCount){
          //   setBlockMenu(false)
          // } 

          console.log(response)

          if (!existeNaoLida) {
            //setBlockMenu(false);
            setBloqueioMenu(false)
          } else{
            toastId = toast({
              title: "Atenção",
              duration: 10000000,
              action: <button className="mt-4 text-sm " onClick={() => {
                dismiss(toastId);
                router.push('/ocupante/notificacoes');
              }}>Visualizar Notificações</button>,
              description:
                "Para prosseguir, é necessário acessar as notificações que ainda não foram lidas, lembrando que o prazo é contado a partir da data de envio pela Concessionária.",
            }).id;
    
            setToastId(toastId);
            //setBlockMenu(true)
            setBloqueioMenu(true)
            console.log(bloqueioMenu)
          }
        } catch (error) {
          console.error("Erro ao buscar notificações:", error);
        }

        return () => {
          dismiss(toastId);
        };
      }
    };

    fetchNotifications();
  }, [user, path]);

useEffect(() => {
  if (toastId) {
    dismiss(toastId);
  }
}, [path]);

  return (
    <nav className="grid overflow-hidden wrap-nowrap gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        const isDisabled = bloqueioMenu && item.href !== "/ocupante/notificacoes" && item.href !== "/" && item.href !== '/painel'; // Verifica se o item não é de notificações
        const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
          if (isDisabled) {
            event.preventDefault();
          } else {
            if (setOpen) setOpen(false);
          }
        };


        return (
          item.href && (
            <Link
              key={index}
              href={isDisabled ? "/" : item.href} 
              onClick={handleClick}
            >
              <span
                className={cn(
                  "group flex items-center max-h-max rounded-md px-3 py-2 text-sm font-medium hover:text-accent-foreground leading-none overflow-hidden",
                  path === item.href
                    ? "bg-accent dark:bg-greenSecundary dark:text-black"
                    : "transparent text-whiteSecundary hover:bg-greenTertiary hover:text-whiteSecundary",
                  isDisabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {expand && (
                  <span className="text-sm text-nowrap overflow-hidden leading-none">
                    {item.title}
                  </span>
                )}
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
