"use client";
import { UsuarioContext } from "@/app/context";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/constants/data";
import { MenuIcon } from "lucide-react";
import { useContext, useState } from "react";


export function MobileSidebar() {
  const user = useContext(UsuarioContext);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              {/* <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2> */}
              <div className="space-y-1">
                <DashboardNav items={navItems[user?.type || ""]} setOpen={setOpen}  expand={true} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
