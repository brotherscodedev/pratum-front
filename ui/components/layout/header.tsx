import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants/data";
import { useContext } from "react";
import { UsuarioContext } from "@/app/context";

export default function Header() {
  const user = useContext(UsuarioContext);
  const path = usePathname();

  const titleScreen = () => {
    const title = navItems[user?.type || ""].filter((x) => x.href == path)[0].title
    return title
  }

  return (
    <nav className="absolute z-50 pr-100 box-content top-0 py-4 pr-8 w-full flex items-center justify-between bg-whiteSecundary dark:bg-grayPrimary" style={{width:'-webkit-fill-available'}}>
      <div className="flex itens-left gap-4">
        <h1 className="text-5xl font-bold">{titleScreen()}</h1>
      </div>

      <div className={cn("block lg:!hidden")}>
        <MobileSidebar />
      </div>

      <div className="flex items-start gap-1">
        <ThemeToggle />
        <UserNav />
      </div>
    </nav>
  );
}
