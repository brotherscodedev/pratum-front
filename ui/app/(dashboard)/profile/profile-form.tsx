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

import ocupanteService, { OcupanteResponseType } from "@/services/ocupante/ocupante-service";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { LoadingSpinner } from "@/components/spinner";
import useAsync from "@/hooks/useAsync";
import { useToast } from "@/components/ui/use-toast";
import { validateCNPJ } from "@/lib/utils";
import CNPJInput from "@/components/cnpj-input";

const formSchema = z.object({
  nomeFantasia: z
    .string().trim().min(1, "Informe o ocupante"),
  razaoSocial: z
    .string().trim().min(1, "Informe a razão social"),
  cnpjCpf: z
    .string().trim().refine((cnpjCpf) => validateCNPJ(cnpjCpf), {message: "CNPJ inválido"}),
  inscricaoEstadual: z
    .string().trim().min(1, "Informe a inscrição estadual"),
  emailPrincipal: z
    .string().email("E-mail inválido"),
  celularPrincipal: z
    .string().trim().min(1, "Informe o celular"),
  endereco: z
    .string().trim().min(1, "Informe o endereço"),
});

export type FormProfileValuesType = z.infer<typeof formSchema>;

const toFormValues = (ocupante?: OcupanteResponseType) => {

  if (!ocupante) return {}

  return {
    nomeFantasia: ocupante.nomeFantasia,
    razaoSocial: ocupante.razaoSocial,
    cnpjCpf: ocupante.cnpj,
    inscricaoEstadual: ocupante.inscricaoEstadual,
    emailPrincipal: ocupante.emailPrincipal,
    celularPrincipal: ocupante.celularPrincipal,
    endereco: ocupante.endereco,
  }
}

const ProfileForm = () => {

  const { toast } = useToast()

  const form = useForm<FormProfileValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const {loading, call: getLoggedProfile} = useAsync(async () => {
    try {
      const response = await ocupanteService.getLoggedProfile();
      form.reset(toFormValues(response || undefined));

    } catch (error) {
      toast({ description: "Não foi possível carregar o perfil.", variant: "erro" });
    }

  }, []);

  useEffect(() => {
    getLoggedProfile();
  }, []);

  const { call: saveLoggedProfile } = useAsync((profileData: FormProfileValuesType) => {
    ocupanteService.saveLoggedProfile(profileData)
      .then(() => {
          form.reset(profileData);
          toast({ description: "Perfil salvo com sucesso.", variant: 'sucesso', position: "top" })
      })
      .catch(() => toast({ description: "Erro ao salvar o perfil.", variant: "erro" , position: "top" }));
  }, []);

  const onSubimit: SubmitHandler<FormProfileValuesType> = (formValues) => {
    saveLoggedProfile(formValues);
  };

  const handleCancel = () => {
    getLoggedProfile();
  }

  const renderNomeFantasia = (field: ControllerRenderProps<FormProfileValuesType, "nomeFantasia">) => (
    <FormItem className="grow">
      <FormLabel>Nome fantasia</FormLabel>
      <FormControl>
        <Input type="input" value={field.value} onChange={field.onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderRazaoSocial = (field: ControllerRenderProps<FormProfileValuesType, "razaoSocial">) => (
    <FormItem className="grow">
      <FormLabel>Razão social</FormLabel>
      <FormControl>
        <Input type="input" value={field.value} onChange={field.onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderCnpj = (field: ControllerRenderProps<FormProfileValuesType, "cnpjCpf">) => (
    <FormItem className="grow">
      <FormLabel>CNPJ</FormLabel>
      <FormControl>
        <CNPJInput value={field.value} onChange={field.onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderInscricaoEstadual = (field: ControllerRenderProps<FormProfileValuesType, "inscricaoEstadual">) => (
    <FormItem className="grow">
      <FormLabel>Inscrição estadual</FormLabel>
      <FormControl>
        <Input type="input" value={field.value} onChange={field.onChange} maxLength={15} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderEmailPrincipal = (field: ControllerRenderProps<FormProfileValuesType, "emailPrincipal">) => (
    <FormItem className="grow">
      <FormLabel>E-mail</FormLabel>
      <FormControl>
        <Input type="input" value={field.value || undefined} onChange={field.onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderCelularPrincipal = (field: ControllerRenderProps<FormProfileValuesType, "celularPrincipal">) => (
    <FormItem className="grow">
      <FormLabel>Celular</FormLabel>
      <FormControl>
        <Input type="input" value={field.value} onChange={field.onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderEndereco = (field: ControllerRenderProps<FormProfileValuesType, "endereco">) => (
    <FormItem className="grow">
      <FormLabel>Endereço</FormLabel>
      <FormControl>
        <Input value={field.value} onChange={field.onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );


  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Form {...form}>
      <form className="max-w-5xl" onSubmit={form.handleSubmit(onSubimit)}>
        <ScrollArea className="space-y-2">
          <div className="flex flex-row gap-3">
            <FormField control={form.control} name="nomeFantasia" render={({ field }) => renderNomeFantasia(field)} />
            <FormField control={form.control} name="razaoSocial" render={({ field }) => renderRazaoSocial(field)} />
          </div>

          <div className="flex flex-row gap-3">
            <FormField control={form.control} name="cnpjCpf" render={({ field }) => renderCnpj(field)} />
            <FormField control={form.control} name="inscricaoEstadual" render={({ field }) => renderInscricaoEstadual(field)} />
          </div>

          <div className="flex flex-row gap-3">
            <FormField control={form.control} name="emailPrincipal" render={({ field }) => renderEmailPrincipal(field)} />
            <FormField control={form.control} name="celularPrincipal" render={({ field }) => renderCelularPrincipal(field)} />
          </div>

          <FormField control={form.control} name="endereco" render={({ field }) => renderEndereco(field)} />

          <div className="flex justify-end flex-row gap-3 pb-10 pt-3">
            <Button disabled={loading || !form.formState.isDirty} type="submit">
              {form.formState.isSubmitting ? <LoadingSpinner /> : null}
              Salvar
            </Button>
            <Button disabled={loading || !form.formState.isDirty} variant="outline" type="button" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
          </ScrollArea>
      </form>
    </Form>
  )
}

export default ProfileForm;