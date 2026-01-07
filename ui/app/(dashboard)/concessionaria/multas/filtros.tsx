import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Label } from "@/components/ui/label"
import { FiltrosMultaType } from "./types"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DescricaoId } from "@/types"
import { Input } from "@/components/ui/input"
import { OcupanteBasicResponseType } from "@/services/concessionaria/concessionaria-service"

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

  const renderFiltroOcupante = () => (
    <Label>
        Ocupante
        <div className="mt-2">
          <Select
            value={values?.ocupanteId?.toString()}
            onValueChange={(value) => onChange({ ...values, ocupanteId: Number(value)})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={-1} value="">Todos</SelectItem>
              {ocupantes?.map((ocupante: DescricaoId) => (
                <SelectItem key={ocupante.id} value={ocupante.id.toString()}>{ocupante.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
      {renderFiltroOcupante()}
      {renderFiltroMotivo()}
      <Button onClick={onPesquisar} className="self-end">
        <Icons.search className="mr-2" />
        Pesquisar
      </Button>
    </div>
  )
}

export default FiltrosMulta