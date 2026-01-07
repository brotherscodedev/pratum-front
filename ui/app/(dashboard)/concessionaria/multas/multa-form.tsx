import { FC, useCallback, useEffect, useState } from "react";
import * as z from "zod";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useAsync from "@/hooks/useAsync";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import CurrencyInput from "@/components/currency-input";
import { FileUploaded } from "@/components/crud/upload";
import UploadInput from "@/components/upload-input";
import concessionariaService, { OcupanteBasicResponseType } from "@/services/concessionaria/concessionaria-service";
import multaService from "@/services/concessionaria/multa-service";
import { BasicResponseType, NoContentResponseType } from "@/services/http";



const formSchema = z.object({
  empresaOcupanteId: z
    .string({required_error: "Informe o ocupante"}),
  vencimento: z
    .string({required_error: "Informe um vencimento"}),
  motivo: z
    .string({required_error: "Informe um motivo"})
    .min(5, {message: "Motivo muito curto."}),
  valor: z
    .string({required_error: "Informe o valor da multa"}),
  boleto: z
    .object({
      nome: z.string(),
      key: z.string(),
      url: z.string(),
      tamanho: z.number(),
    }, { required_error: "O boleto da multa é obrigatório" })
});

export type FormMultaValuesType = z.infer<typeof formSchema>;

type FormMultaPropsType = {
  formValues?: FormMultaValuesType;
  onSalvar: () => void;
  onCancelar: () => void;
}

const FormMulta: FC<FormMultaPropsType> = ({formValues, onSalvar, onCancelar}) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [ocupantes, setOcupantes] = useState<OcupanteBasicResponseType[]>([]);

  const form = useForm<FormMultaValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
  })

  const { toast } = useToast()

  const { call: listOcupantes } = useAsync(async () => {
    try {
      const response = await concessionariaService.getOcupantes();
      setOcupantes(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect( () => {
    listOcupantes();
  }, [listOcupantes]);

  const handleSavedSuccess = useCallback(() => {
    toast({
      title: "Aviso",
      description: "Multa salva com sucesso!", 
      variant: "sucesso",
      position: "top" 
    });
    setLoading(false);
    onSalvar();
  }, []);

  const onSubmit: SubmitHandler<FormMultaValuesType> = (data) => {
    setLoading(true);
    const body = {...data, valor: Number(data.valor), empresaOcupanteId: Number(data.empresaOcupanteId)}

    multaService.saveMulta(body)
      .then(() => handleSavedSuccess())
      .catch(() => {
        setLoading(false);
        toast({
          title: "Erro", 
          description: "Não foi possível salvar a multa", 
          variant: "erro",
          position: "top"
        })
      })
  };

  const handleUpload = useCallback((file: FileUploaded) => {
    form.resetField("boleto", {defaultValue: file});
  }, []);

  const handleUploadClear = useCallback(() => {
    form.resetField("boleto", {defaultValue: null as any});
  }, []);

  const renderCampoOcupante = (field: ControllerRenderProps<FormMultaValuesType, "empresaOcupanteId">) => (
    <FormItem>
      <FormLabel>Ocupante</FormLabel>
      <FormControl>
        <Select
          value={field.value?.toString()}
          onValueChange={field.onChange}
          defaultValue={field.value?.toString()}
          >
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {ocupantes?.map((ocupante: BasicResponseType) => (
              <SelectItem key={ocupante.id} value={ocupante.id.toString()}>{ocupante.descricao}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderCampoMotivo = (field: ControllerRenderProps<FormMultaValuesType, "motivo">) => (
    <FormItem>
      <FormLabel>Motivo</FormLabel>
      <FormControl>
        <Textarea
          rows={4}
          placeholder="Informe um motivo para multa..."
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderCampoVencimento = (field: ControllerRenderProps<FormMultaValuesType, "vencimento">) => (
    <FormItem>
      <FormLabel>Vencimento</FormLabel>
      <FormControl>
        <Input style={{width: 'fit-content'}} type="date" value={field.value} onChange={field.onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderCampoValor = (field: ControllerRenderProps<FormMultaValuesType, "valor">) => (
    <FormItem>
      <FormLabel>Valor</FormLabel>
      <FormControl>
        <CurrencyInput value={field.value} onChange={  field.onChange } />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderCampoBoleto = (field: ControllerRenderProps<FormMultaValuesType, "boleto">) => (
    <FormItem>
      <FormLabel>Boleto</FormLabel>
      <FormControl>
        <UploadInput
          file={field.value}
          onUpload={handleUpload}
          onClear={handleUploadClear}
          />
      </FormControl>
      <FormMessage />
    </FormItem>
  );



  return ( null //TODO  ajustar form
    // <Form {...form}>
    //   <form className="space-y-2 w-full" onSubmit={form.handleSubmit(onSubmit)}>
    //     <FormField
    //       control={form.control}
    //       name="empresaOcupanteId"
    //       render={({ field }) => renderCampoOcupante(field) }>
    //     </FormField>

    //     <div className="flex flex-row place-content-between">
    //       <FormField
    //         control={form.control}
    //         name="vencimento"
    //         render={({ field }) => renderCampoVencimento(field) }>
    //       </FormField>


    //       <FormField
    //         control={form.control}
    //         name="valor"
    //         render={({ field }) => renderCampoValor(field)}>
    //       </FormField>

    //       <FormField
    //           control={form.control}
    //           name="boleto"
    //           render={({ field }) => renderCampoBoleto(field)}>
    //       </FormField>
    //     </div>

    //     <FormField
    //       control={form.control}
    //       name="motivo"
    //       render={({ field }) => renderCampoMotivo(field)}>
    //     </FormField>

    //     <div className="flex justify-end flex-row gap-3">
    //       <Button disabled={loading} type="submit">
    //         Salvar
    //       </Button>
    //       <Button disabled={loading} variant="outline" type="button" onClick={onCancelar}>
    //         Cancelar
    //       </Button>
    //     </div>
    //   </form>
    // </Form>
  )
}

export default FormMulta;