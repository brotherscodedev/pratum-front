"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const formSchema = z.object({
  email: z
    .string({ required_error: "Informe seu email" })
    .email({ message: "Informe um email válido" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function RecuperarSenha() {
  const [submit, setSubmit] = useState(false);
  const { toast } = useToast();
  const defaultValues = {};
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      setSubmit(true);
      const res = await fetch("/api/backend", {
        method: "POST",
        body: JSON.stringify({
          uri: "forgotpass",
          data
        }),
      });
      toast({
        description:
          "Se seu email estiver correto, você receberá um email com instruções para redefinir sua senha.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-3 lg:px-0">
        <div></div>
        {submit && (
          <>
            <h2>Aguarde o recebimento do Código de Recuperação</h2>
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm text-primary underline">
                Voltar
              </Link>
            </div>
          </>
        )}
        {!submit && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Informe seu email..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Link href="/" className="text-sm text-primary underline">
                  Voltar
                </Link>
                <Link href="/redefinir-senha" className="text-sm text-primary underline">
                  Informar Código de Recuperação
                </Link>
              </div>
              <Button className="ml-auto w-full " type="submit">
                Enviar codigo de Recuperação
              </Button>
            </form>
          </Form>
        )}
      </div>
    </>
  );
}
