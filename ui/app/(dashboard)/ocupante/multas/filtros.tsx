import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { OcupanteBasicResponseType } from "@/services/concessionaria/concessionaria-service"

import { FiltrosMultaType } from "./types"

type FiltroMultaPropsType = {
  values: FiltrosMultaType,
  ocupantes: OcupanteBasicResponseType[] | undefined,
  onPesquisar: () => void,
  onChange: (filtros: FiltrosMultaType) => void,
}

export const FiltrosMulta = ({
  values,
  ocupantes,
  onChange,
  onPesquisar,
}: FiltroMultaPropsType) => {

  const renderFiltroVencimento = () => (
    <Label>
      Vencimento
      <CalendarDateRangePicker
          className="mt-2 flex justify-center align-center"
          from={values?.vencimentoDe}
          to={values?.vencimentoAte}
          onChange={({ from, to }: any) =>
            onChange({
              ...values,
              vencimentoDe: from,
              vencimentoAte: to,
            })
          }
        />
    </Label>
  )

  const renderFiltroMotivo = () => (
    <Label>
      Motivo
      <Input
        value={values?.motivo}
        className="mt-2"
        onChange={(e) => {
          onChange({ ...values, motivo: e.target.value });
        }}
      />
    </Label>
  )

  return (
    <div className="flex flex-row space-x-4">
      {renderFiltroVencimento()}
      {renderFiltroMotivo()}
      <Button onClick={onPesquisar} className="self-end">
        <Icons.search className="mr-2" />
        Pesquisar
      </Button>
    </div>
  )
}

export default FiltrosMulta