import { FC } from "react";
import { formatDateTime } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { Icons } from "./icons";
import { AvisoResponseType } from "@/services/usuario-service";

type AvisosPropsType = {
  avisos?: AvisoResponseType[];
  loading?: boolean
  onMarkRead?: (aviso: AvisoResponseType) => void;
}

const Avisos: FC<AvisosPropsType> = ({ avisos, onMarkRead, loading = false }: any) => {
  return (
    <div className="column space-y-2 py-0 pl-6 pr-4 pb-6 h-[500px] overflow-auto">
      {avisos?.map((aviso: AvisoResponseType) => (
        <div key={aviso.id} className="flex items-center p-3 gap-4 rounded-md bg-whiteSecundary dark:bg-greenGrayLight justify-between">
          <div className="space-y-1">
            <p className="text-sm text-black">{aviso.descricao}</p>
            <p className="text-sm font-medium leading-none text-right text-black">
              {formatDateTime(aviso.updatedAt)}
            </p>
          </div>
          <div>
            <IconButton className="text-black" disabled={loading} icon={<Icons.eye />} title='Marcar como lido' onClick={() => onMarkRead(aviso)} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Avisos;
