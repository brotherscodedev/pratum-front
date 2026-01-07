import { ChangeEvent, FC, useCallback, useState } from "react";
import { Input } from "./ui/input";

type CurrencyInputPropsType = {
  onChange: (value: string) => void;
  value: string;
}

const CurrencyInput: FC<CurrencyInputPropsType> = ({onChange, value}) => {
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    const sanitizeValue = inputText.replace(/[^0-9]/g, "");
    onChange(sanitizeValue)
  }, []);

  const formatCurrency = useCallback((value: string) => {
    return (parseInt((value || '0')) / 100).toLocaleString("pt-BR", {
      style: "decimal",
      currency: "BRL",
      minimumFractionDigits: 2,
      minimumIntegerDigits: 1,
    });
  }, []);

  return (
    <Input
      type="text"
      value={formatCurrency(value)}
      onChange={handleChange}
      placeholder="Informe um valor"
    />
  )
}

export default CurrencyInput