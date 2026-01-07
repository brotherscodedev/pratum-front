import { ChangeEvent, FC, useCallback } from "react";
import { Input } from "./ui/input";
import { formatCNPJ } from "@/lib/utils";

type CNPJInputPropsType = {
  onChange: (value: string) => void;
  value: string;
}

const CNPJInput: FC<CNPJInputPropsType> = ({onChange, value}) => {
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    const sanitizeValue = inputText.replace(/[^0-9]/g, "");
    onChange(sanitizeValue)
  }, []);

  return (
    <Input
      type="text"
      value={formatCNPJ(value)}
      onChange={handleChange}
      maxLength={18}
    />
  )
}

export default CNPJInput