"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormValues } from "@/validations/login";

export function LoginForm({
  onSubmit,
}: {
  onSubmit?: (values: LoginFormValues) => void;
}) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      className="space-y-3"
      onSubmit={form.handleSubmit((values) => onSubmit?.(values))}
      noValidate
    >
      <div>
        <label htmlFor="login-email" className="mb-1 block text-xs text-slate-300">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100"
          {...form.register("email")}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-1 block text-xs text-slate-300">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100"
          {...form.register("password")}
        />
      </div>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
}
