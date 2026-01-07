import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";

import Image from "next/image";

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-t bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="flex itens-center gap-4">
          <div className="hidden lg:block">
            <Image src="/logonew.png" alt="Pratum" width={80} height={40} />
          </div>
        </div>
      </nav>
    </div>
  );
}
