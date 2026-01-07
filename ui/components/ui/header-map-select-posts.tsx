import { Button } from "./button"
import { Label } from "./label"
import { Input } from "./input"

interface HeaderSelectPostsProps {
    municipio : string
    onChangeMunicipio : (value: string) => void
    onAttach ?: () => void
    onReturn ?: () => void
    onSearch ?: () => void
    onSave ?: () => void
}

export default function HeaderSelectPosts(
    {
    municipio,
    onChangeMunicipio,
    onAttach,
    onReturn,
    onSearch,
    onSave 
    } : HeaderSelectPostsProps
){

    const renderFiltroMunicipio = () => (
        <Label>
          Município
          <Input
            value={municipio}
            className="mt-2"
            onChange={(e) => {
              onChangeMunicipio(e.target.value)
            }}
          />
        </Label>
      )

    return (
        <div className="flex justify-between items-center" >
            <div className="flex items-center gap-10" >
                {renderFiltroMunicipio()}
                <Button className="text-greenTertiary bg-white my-6" onClick={onSearch || (() => console.log(municipio))} variant="default" size="lg">
                    Pesquisar
                </Button>
            </div>

            <div className="flex items-center gap-10" >
                <Button className="text-greenTertiary bg-white my-6" onClick={onReturn || (() => {})} variant="default" size="lg">
                    Voltar
                </Button>
                <Button className="text-greenTertiary bg-white my-6" onClick={onAttach || (() => {})} variant="default" size="lg">
                    Anexar
                </Button>
                <Button className="text-greenTertiary bg-white my-6" onClick={onSave || (() => {})} variant="default" size="lg">
                    Salvar
                </Button>
            </div>
        </div>
    )
}