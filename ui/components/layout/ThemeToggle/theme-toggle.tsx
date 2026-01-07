"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type CompProps = {};
export default function ThemeToggle({}: CompProps) {
  const { setTheme, theme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="flex h-8 w-8 justify-center items-center bg-greenTertiary rounded-md dark:bg-greenGray">
          {theme == 'dark'
            ? <MoonIcon className="h-[1.2rem] w-[1.2rem] text-whiteSecundary" />
            : <SunIcon className='h-[1.2rem] w-[1.2rem] text-whiteSecundary' />
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col justify-center bg-greenTertiary rounded-md text-whiteSecundary dark:bg-greenGray">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Automático
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
