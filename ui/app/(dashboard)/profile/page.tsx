"use client";

import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";

import ProfileForm from "./profile-form";

const breadcrumbItems = [{ title: "Perfil", link: "/dashboard/profile" }];
export default function page() {

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ProfileForm />
      </div>
    </ScrollArea>
  );
}
