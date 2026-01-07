"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { useContext, useState } from "react";
import { Icons } from "../icons";
import { UsuarioContext } from "@/app/context";
import Image from "next/image";

export default function Sidebar({ ...props }) {
  const user = useContext(UsuarioContext);
  const [expand, setExpand] = useState<boolean>(false);
  const Icon = Icons["arrowRight"];

  return (
    <nav
      className={cn(
        `flex flex-col relative h-screen justify-between gap-12 bg-black px-4 py-8 content-between ${
          expand ?? "w-96"
        }`
      )}
    >
      <div>
        <div className="w-30 h-20  flex items-center"> 
          {/* <img className="" src="logonew.png" alt="SIGA" />  */}
          <Image src="/logonew.png" alt="SIGA" width={80} height={60} />
        </div> 
        
        <div>
          <DashboardNav items={navItems[user?.type || ""]} expand={expand} />
        </div>
      </div>
      <div className="flex h-full w-full items-end">
        <button
          onClick={() => setExpand(!expand)}
          type="button"
          className="flex h-fit w-full justify-end rounded-md px-3 py-2 text-sm font-medium text-whiteSecundary hover:bg-accent hover:text-black"
        >
          <Icon
            className={`mr-2 h-4 w-4 flex origin-center ${
              expand ?? "rotate-180"
            }`}
          />
        </button>
      </div>
    </nav>
  );
}
