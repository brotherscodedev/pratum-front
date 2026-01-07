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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useAsync from "@/hooks/useAsync";
import usuarioService, { AvisoResponseType } from "@/services/usuario-service";
import { useCallback, useEffect, useState } from "react";

export default function PainelConcessionaria() {
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
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2"></div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avisos</CardTitle>
                  <Icons.page className="mr-2 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avisos?.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {/* Verifique e resolva as pendencias */}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Notificações
                  </CardTitle>
                  <Icons.alert className="mr-2 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">
                    Consulte suas Notificações
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Pontos Ativos</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Avisos</CardTitle>
                  <CardDescription>
                    {avisos?.length || 0} Avisos encontrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Avisos avisos={avisos} onMarkRead={handleMarkRead} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
