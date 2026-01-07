"use client";
import Avisos from "@/components/avisos";
import { Icons } from "@/components/icons";
import { Overview } from "@/components/overview";
import { LoadingSpinner } from "@/components/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useAsync from "@/hooks/useAsync";
import usuarioService, { AvisoResponseType } from "@/services/usuario-service";
import { useCallback, useEffect, useState } from "react";

export default function PainelOcupante() {

  const [avisos, setAvisos] = useState<AvisoResponseType[]>()

  const { loading, call: listAvisos } = useAsync(async() => {
    const response = await usuarioService.getAvisosUsuario()
    setAvisos(response);
  }, [])

  useEffect(() => {
    listAvisos();
  }, []);

  const removeAviso = useCallback((avisoId: number) => {
    const newAvisos = avisos?.filter((aviso) => aviso.id !== avisoId);
    setAvisos(newAvisos);
  }, [avisos]);

  const handleMarkRead = useCallback((aviso: AvisoResponseType) => {
    usuarioService.markReadAvisoUsuario(aviso.id)
      .then(() => removeAviso(aviso.id) );
  }, [avisos]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    // <Tabs defaultValue="overview" className="h-full w-full box-border box-sizing overflow-auto">
    //   <TabsContent value="overview" className="space-y-4">
    <div className="h-full max-h-full space-y-4">
        <div className="gap-4 grid grid-cols-4">
          <Card className="bg-greenTertiary dark:bg-greenGray">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl font-normal text-whiteSecundary leading-none">
                Avisos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-end">
              <div className="text-4xl font-bold text-whiteSecundary">{avisos?.length}</div>
              <p className="text-xs text-muted-foreground">
                {/* Verifique e resolva as pendencias */}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4 ">
          <Card className="bg-greenTertiary dark:bg-greenGray">
          </Card>
          <Card className="column space-y-2 bg-greenTertiary dark:bg-greenGray ">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-whiteSecundary">Avisos</CardTitle>
              <div className="flex items-center gap-3">
                <Icons.trash className="text-whiteSecundary"/>
                <CardDescription className="text-4xl font-bold text-whiteSecundary">
                  {avisos?.length}
                </CardDescription>
              </div>
            </CardHeader>
            <div className="">
              <Avisos loading={loading} avisos={avisos} onMarkRead={handleMarkRead}/>
            </div>
          </Card>
        </div>
    </div>

    //   </TabsContent>
    // </Tabs>
  );
}
