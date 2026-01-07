"use client";
import { Icons } from "@/components/icons";
import { LoadingSpinner } from "@/components/spinner";
import { useToast } from "@/components/ui/use-toast";
import useAsync from "@/hooks/useAsync";
import geralService from "@/services/geral";
import { CidadeResponseType } from "@/services/geral/types";
import projetoService, {
  ProjetoResponseType,
} from "@/services/projeto-service";
import { useEffect, useState } from "react";
import { Pesquisa } from "@/components/crud/pesquisa";
import { formatDate, statusProjetoMap } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page({ params }: { params: { idProjeto: number } }) {

  const { toast } = useToast();
  const router = useRouter(); 
  const { idProjeto } = params;
  const breadcrumbItems = [
    { title: "Projetos", link: "/ocupante/projetos" },
    {
      title: "Detalhes do Projeto " + idProjeto,
      link: "/ocupante/projetos/detalhes/" + idProjeto,
    },
  ];

  const [projeto, setProjeto] = useState<ProjetoResponseType>();
  const [cidade, setCidade] = useState<CidadeResponseType>();

  // Funções
  const visualizarProjeto = () => {
    router.push("/ocupante/projetos");
  };

  const { loading: loading, call: pesquisar } = useAsync(async () => {
    try {
      const projetoResponse = await projetoService.getProjeto(idProjeto);
      setProjeto(projetoResponse);

      const cidadeResponse = await geralService.getCidade(
        projetoResponse.projeto.cidadeId
      );
      setCidade(cidadeResponse);
    } catch (error) {
      toast({
        description: "Não foi possível carregar o projeto",
        variant: "erro",
        position: "top"
      });
    }
  }, []);

  useEffect(() => {
    pesquisar();
  }, []);

  //Renders
  const RenderBotaoVoltar = () => (
    <Button
        className="secondary"
        title="Voltar para pagina de Projeto"
        onClick={() => visualizarProjeto()}
      >
        <span className="ml-1" > Voltar </span>
      </Button>
  )

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <> 
    
    <Pesquisa
      breadcrumbItems={[]}
      titulo={projeto?.projeto.descricao || ""}
      botoes={null}
      filtros={null}
      grid={
        <>
          
          <p className="leading-7 [&:not(:first-child)]:mt-6"></p>
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Situação: {statusProjetoMap[projeto?.projeto.status || ""]}
          </h2>
          {projeto?.projeto.protocolo && (
            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
              Protocolo: {projeto?.projeto.protocolo}
            </h3>
          )}
          <h3 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Cidade: {`${cidade?.nome}-${cidade?.uf}`}
          </h3>
          <h3 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Quantidade de Pontos: {projeto?.postes.length}
          </h3>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Arquivos adicionados ao projeto
          </h3>
          <div className="my-6 w-full overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    Nome do Arquivo
                  </th>
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody>
                {projeto?.projeto.arquivos.map((arquivo, index) => (
                  <tr className="m-0 border-t p-0 even:bg-muted">
                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                      {arquivo.nome}
                    </td>
                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                      <a href={arquivo.url}>
                        <Icons.download />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {!!projeto?.projeto.anotacoes?.length && (
            <>
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                Anotações
              </h3>
              <div className="my-6 w-full overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="m-0 border-t p-0 even:bg-muted">
                      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                        DATA
                      </th>
                      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                        STATUS
                      </th>
                      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                        DESCRIÇÃO
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projeto?.projeto.anotacoes.map((anot, index) => (
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          {formatDate(anot.createdAt)}
                        </td>
                        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          {statusProjetoMap[anot.novoStatus]}
                        </td>
                        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                          {anot.descricao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {RenderBotaoVoltar()}
        </>
      }
    />
    </>
  );
}
