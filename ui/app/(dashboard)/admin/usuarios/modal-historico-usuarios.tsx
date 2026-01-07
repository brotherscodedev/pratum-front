"use client";

import { SimpleModal } from "@/components/modal/simple-modal";
import { Historico } from "@/services/admin-service/usuario/types";

type HistoricoProjetoModalProps = {
  isOpen: boolean;
  historico: Historico;
  onClose: () => void;
};

const HistoricoProjetoModal = ({
  isOpen,
  onClose,
  historico
}: HistoricoProjetoModalProps) => {

  
  // Renders
  function renderHistorico(historico: Historico ) {
    if (!historico.mensagens || historico.mensagens.length === 0) {
      return <div className="text-white">Esse Usuario não possui historico</div>;
    } 
  
    return historico.mensagens.slice().reverse().map((item: any, index: number, reversedArray: any[]) => {
  
      return (
        <div key={ `mensagem 3 ${index} `}>
            <div key={ `mensagem 1 ${index} `}  className={`space-y-4 w-[70%] `}>
            <p className={`text-gray-200 text-sm`}>
                {item.data}
            </p>
            <div className="bg-[#163233] p-2 rounded-lg text-start">
                <p className="text-gray-400 text-sm text-start pt-4">
                    Situacão Atual: {item.situacaoAtual}
                </p>
                <p className="text-gray-400 text-sm text-start pt-4">
                    Situacão Anterior: {item.situacaoAnterior}
                </p>
                <p className="text-gray-400 text-sm text-start pt-4">
                    Alterado por: {item.alteradoPor}
                </p>
                
                {/* <p className="text-gray-200">{item.mensagem}</p> 
                <p className="text-gray-400 text-sm text-end pt-4">
                {new Date(item.data).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })}
                </p> */}
            </div>
            </div>
            <div key={ `mensagem 2 ${index} `} className={`space-y-4 w-[70%] `}>
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
            </div>
        </div>
      );
    });
  }

  return (
    <SimpleModal
      open={isOpen}
      titulo={ "Historico Usuario" }
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

export default HistoricoProjetoModal;
