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
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import GoogleSignInButton from "../github-auth-button";
import Link from "next/link";

const formSchema = z.object({
  email: z
    .string({ required_error: "Informe seu email" })
    .email({ message: "Informe um email válido" }),
  password: z.string({ required_error: "Informe sua senha" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const defaultValues = {};
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl ?? "/painel",
    });
  };

  return (
    <>
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
                <FormLabel className="text-whiteSecundary">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Informe seu email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="border-1 border-whiteSecundary">
                <FormLabel className="text-whiteSecundary">Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between pt-2 pb-4 space-x-10">
            <Link
              href="/esqueci-minha-senha"
              className="text-sm text-whiteSecundary color-whiteSecundary"
            >
              Esqueceu sua senha?
            </Link>
            <Link
              href="/redefinir-senha"
              className="text-sm text-whiteSecundary color-whiteSecundary"
            >
              Redefinir senha
            </Link>
          </div>
          <Button disabled={loading} className="p-1.5 rounded-superSmall w-full bg-greenSecundary text-black hover:shadow-lg hover:shadow-greenSecundary/20" type="submit">
            Acessar
          </Button>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou acesse com
          </span>
        </div>
      </div>
      <GoogleSignInButton /> */}
    </>
  );
}
