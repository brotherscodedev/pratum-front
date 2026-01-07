import { FC, useEffect, useRef, useState } from "react";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CidadeBasicResponseType } from "@/services/cidade-service/types";
import { FiltrosNotificacaoType } from "./types";
import AutoSuggestion from "@/app/src/components/input/autosuggestion-input";

type FiltrosNotificacaoPropsType = {
  onPesquisar: () => void;
  values: FiltrosNotificacaoType;
  cidades?: CidadeBasicResponseType[];
  onChange: (filtros: FiltrosNotificacaoType) => void;
}

const tiposDeNotificacao = [
  "Conclusão de inventário",
  "Início de inventário",
  "Irregularidades técnicas",
  "Parecer da defesa de inventário",
  "Postes à revelia",
  "Projeto de regularização",
  "Relação contratual",
  "Risco imediato",
  "Solicitação de documentos",
  "Avisos diversos",
  "Obras na rede",
  "Vistorias programadas",
];

const tiposDeStatus = [
 "Rascunho",
	"Enviada",
	"Visualizada",
	"Em defesa",
	"Concluida",
	"Inativa"
];

export const FiltrosNotificacao: FC<FiltrosNotificacaoPropsType> = ({
  onPesquisar,
  values,
  cidades,
  onChange,
}: any) => {
    const [searchTerm, setSearchTerm] = useState(values.tipo || "");
    const [filteredSuggestions, setFilteredSuggestions] = useState(tiposDeNotificacao);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const suggestionsRef = useRef<HTMLUListElement | null>(null);
    const [status, setStatus] = useState("");

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchTerm(value);
        setFilteredSuggestions(
          tiposDeNotificacao.filter((tipo) =>
            tipo.toLowerCase().includes(value.toLowerCase())
          )
        );
        setSelectedIndex(-1);
        onChange({ ...values, tipo: value });
      };
    
      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown" || e.key === "Tab") {
          e.preventDefault();
          if (selectedIndex < filteredSuggestions.length - 1) {
            setSelectedIndex((prev) => prev + 1);
          } else {
            setSelectedIndex(0);
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (selectedIndex > 0) {
            setSelectedIndex((prev) => prev - 1);
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (selectedIndex >= 0) {
            const selectedSuggestion = filteredSuggestions[selectedIndex];
            setSearchTerm(selectedSuggestion);
            onChange({ ...values, tipo: selectedSuggestion });
            setFilteredSuggestions([]);
          }
        }
      };
    
      const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
        onChange({ ...values, tipo: suggestion });
        setFilteredSuggestions([]);
      };
    
      useEffect(() => {
        if (suggestionsRef.current && selectedIndex >= 0) {
          const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
          selectedElement?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, [selectedIndex]);
    
  return (
    <div className="flex flex-row bg-greenTertiary text-white w-full p-5 -mb-4 space-x-4">
      <Label>
        Data
        <CalendarDateRangePicker
          className="mt-2 flex justify-center align-center"
          from={values?.prazoDe}
          to={values?.prazoAte}
          onChange={({ from, to }: any) =>
            onChange({
              ...values,
              prazoDe: from,
              prazoAte: to,
            })
          }
        />
      </Label>
      <Label>
        Cidade
        <div className="mt-2">
          <Select
            value={values?.cidadeId}
            onValueChange={(value) => onChange({ ...values, cidadeId: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem key={-1} value={""}>Todas</SelectItem>
              {cidades?.map((cidade: CidadeBasicResponseType) => (
                <SelectItem key={cidade.id} value={cidade.id.toString()}>{cidade.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Label>
      <Label>
        Tipo de notificação
        <div className="relative mt-2">
          <Input
            value={searchTerm}
            className="border border-gray"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {filteredSuggestions.length > 0 && searchTerm && (
            <ul
              ref={suggestionsRef}
              className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md z-10 max-h-40 overflow-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 hover:bg-gray-100 text-black dark:text-black cursor-pointer ${selectedIndex === index ? "bg-gray-200" : ""}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Label>
      <Label>
        ID notificação
        <Input
          value={values?.id}
          type="number"
          className="mt-2"
          onChange={(e) => {
            onChange({ ...values, id: e.target.value });
          }}
        />
      </Label>
      <AutoSuggestion
        label="Tipo de Status"
        options={tiposDeStatus}
        value={values.status}
        onChange={(newStatus) => onChange({ ...values, status: newStatus })}
      />

      <Button onClick={onPesquisar} className="self-end bg-white text-black w-40 hover:bg-gray-400 p-4 p-4">
          Pesquisar
        </Button>
    </div>
  );
};
