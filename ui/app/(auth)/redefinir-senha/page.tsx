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
import { LoadingSpinner } from "@/components/spinner";
import { redirect } from "next/navigation";

const formSchema = z.object({
  code: z.string({ required_error: "Informe o código de recuperação" }),
  newPass: z.string({ required_error: "Informe a nova senha" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function RedefinirSenha() {
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
          uri: "changepass",
          data,
        }),
      });
      redirect("/");
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
            <LoadingSpinner />
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de recuperação</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o codigo de recuperação..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="newPass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
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
              </div>
              <Button className="ml-auto w-full " type="submit">
                Alterar senha
              </Button>
            </form>
          </Form>
        )}
      </div>
    </>
  );
}
