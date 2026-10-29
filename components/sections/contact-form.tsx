"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/contact-schema";

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = contactFormSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field as keyof ContactFormValues]) {
          nextErrors[field as keyof ContactFormValues] = issue.message;
        }
      }
      setErrors(nextErrors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("success");
    setValues({ name: "", email: "", message: "" });
  }

  return (
    <div></div>
  );
}
