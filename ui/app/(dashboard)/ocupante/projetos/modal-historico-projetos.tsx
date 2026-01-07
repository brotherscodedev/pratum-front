"use client";

import { SimpleModal } from "@/components/modal/simple-modal";
import { Historico } from "@/services/admin-service/usuario/types";
import { ProjetoGeralInteracao } from "@/services/projeto-service/types";

type HistoricoProjetosModalProps = {
  isOpen: boolean;
  historico: ProjetoGeralInteracao [];
  onClose: () => void;
};

const HistoricoProjetosModal = ({
  isOpen,
  onClose,
  historico
}: HistoricoProjetosModalProps) => {

  // Funcoes
  function converter(valor : "RA" | "RE" | "AN" | "FI" | "PA" | "AP"){
    switch(valor){
      case "RE" :{
        return "Reprovado"
      }
      case "AN" :{
        return "Analise"
      }
      case "RA" :{
        return "Rascunho"
      }
      case "PA" :{
        return "Pausado"
      }
      case "AP" :{
        return "Aprovado"
      }
      case "FI" :{
        return "Em Fila"
      }
    }
  }
  
  // Renders
  function renderHistorico(historico: ProjetoGeralInteracao []) {
    if (!historico || historico.length === 0) {
      return <div className="text-white">Esse Projeto não possui historico</div>;
    } 
  
    return historico.slice().reverse().map((item: any, index: number, reversedArray: any[]) => {
  
      return (
        <div key={ `mensagem 3 ${index} `}>
            <div key={ `mensagem 1 ${index} `}  className={`space-y-4 w-[70%] `}>
            <p className={`text-gray-200 text-sm`}>
                {/* { converter(item.status) } */}
                {item.usuario.name}
            </p>
            <div className="bg-[#163233] p-2 rounded-lg text-start">
                <p className="text-gray-400 text-sm text-start pt-4">
                    {item.mensagem}
                </p>
                {/* <p className="text-gray-400 text-sm text-start pt-4">
                    Alterado por: {item.usuario.name}
                </p> */}
                
                {/* <p className="text-gray-200">{item.mensagem}</p>  */}
                <p className="text-gray-400 text-sm text-end pt-4">
                {new Date(item.data).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })}
                </p>
            </div>
            </div>
            {/* <div key={ `mensagem 2 ${index} `} className={`space-y-4 w-[70%] `}>
            <p className={`text-gray-200 text-sm pt-4`}>
                {item.data}
            </p>
            <div className="bg-[#163233] p-2 rounded-lg text-start">
                <p className="text-gray-400 text-sm text-start pt-4">
                    Empresa Atual: {item.empresaAtual}
                </p>
                <p className="text-gray-400 text-sm text-start pt-4">
                    Empresa Anterior: {item.empresaAnterior}
                </p>
                <p className="text-gray-400 text-sm text-start pt-4">
                    Alterado por: {item.alteradoPor}
                </p>
                
            </div>
            </div> */}
        </div>
      );
    });
  }

  return (
    <SimpleModal
      open={isOpen}
      titulo={ "Historico do Projeto" }
      descricao=""
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <div className="space-y-4 bg-greenTertiary">
        {/* <span className="block pl-4 mt-6 text-white dark:text-white">Historico Usuario</span> */}
        <hr className="bg-white"/>
        <div className="flex flex-col space-y-4 p-4 max-h-[487px] overflow-y-auto">
          {renderHistorico(historico)}
        </div>
      </div>
    </SimpleModal>
  );
};

export default HistoricoProjetosModal;
