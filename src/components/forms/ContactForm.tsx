"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { contactSchema, type ContactFormValues } from "@/validations/contact";

export function ContactForm({
  onSubmit,
}: {
  onSubmit?: (values: ContactFormValues) => void;
}) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  return (
    <form
      className="space-y-3"
      onSubmit={form.handleSubmit((v) => onSubmit?.(v))}
      noValidate
    >
      <input
        aria-label="Name"
        autoComplete="name"
        className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100"
        placeholder="Name"
        {...form.register("name")}
      />
      <input
        aria-label="Email"
        type="email"
        autoComplete="email"
        className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100"
        placeholder="Email"
        {...form.register("email")}
      />
      <textarea
        aria-label="Message"
        rows={4}
        className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100"
        placeholder="Message"
        {...form.register("message")}
      />
      <Button type="submit">Send</Button>
    </form>
  );
}
