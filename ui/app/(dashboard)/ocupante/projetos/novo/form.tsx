import { useEffect } from "react";
import * as z from "zod";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ocupanteService, {
  OcupanteResponseType,
} from "@/services/ocupante/ocupante-service";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { LoadingSpinner } from "@/components/spinner";
import useAsync from "@/hooks/useAsync";
import { useToast } from "@/components/ui/use-toast";
import { validateCNPJ } from "@/lib/utils";
import CNPJInput from "@/components/cnpj-input";
import { DescricaoId } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormProjetoValuesType } from "./page";
import { BasicResponseType } from "@/services/http";

const formSchema = z.object({
  descricao: z.string({required_error: "Informe a descrição do projeto"}),
  cidadeId: z.string({required_error: "Informe a cidade"}),
});

export type FormProfileValuesType = z.infer<typeof formSchema>;

interface ProjetoFormProps {
  cidades: BasicResponseType[];
  onCancel: () => void;
  onSubmit: SubmitHandler<FormProjetoValuesType>;
}

const ProjetoForm = ({ cidades, onCancel, onSubmit }: ProjetoFormProps) => {
  const { toast } = useToast();

  const form = useForm<FormProfileValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const renderDescricao = (
    field: ControllerRenderProps<FormProfileValuesType, "descricao">
  ) => (
    <FormItem className="grow">
      <FormLabel>Descrição</FormLabel>
      <FormControl>
        <Input type="input" value={field.value} onChange={field.onChange} className="border border-gray" />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderCidade = (
    values: BasicResponseType[],
    field: ControllerRenderProps<FormProjetoValuesType, "cidadeId">
  ) => (
    <FormItem>
      <FormLabel>Cidade</FormLabel>
      <FormControl>
        <Select
          value={field.value?.toString()}
          onValueChange={field.onChange}
          defaultValue={field.value?.toString()}

          >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {cidades?.map((cidade: BasicResponseType) => (
              <SelectItem key={cidade.id} value={cidade.id.toString()}>{cidade.descricao}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  return (
    <Form {...form}>
      <form className="max-w-5xl" onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="space-y-2">
          <div className="flex flex-row gap-3">
            <FormField
              control={form.control}
              name="cidadeId"
              render={({ field }) => renderCidade(cidades, field)}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => renderDescricao(field)}
            />
          </div>

          <div className="flex justify-end flex-row gap-3 pb-10 pt-3">
            <Button disabled={!form.formState.isValid} type="submit">
              {form.formState.isSubmitting ? <LoadingSpinner /> : null}
              Salvar
            </Button>
            <Button
              disabled={!form.formState.isDirty}
              variant="outline"
              type="button"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </div>
        </ScrollArea>
      </form>
    </Form>
  );
};

export default ProjetoForm;
