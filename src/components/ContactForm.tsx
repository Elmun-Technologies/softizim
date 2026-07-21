"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { services } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 placeholder:text-muted/70";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Xatolik yuz berdi");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
          <Icon name="check" size={28} />
        </span>
        <h3 className="mt-5 text-xl font-semibold">Rahmat!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Xabaringiz qabul qilindi. Jamoamiz tez orada siz bilan bog&apos;lanadi.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Yana yuborish
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Ism <span className="text-brand-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            placeholder="Ismingiz"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+998 90 123 45 67"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email <span className="text-brand-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="siz@email.com"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium">
            Xizmat turi
          </label>
          <select id="service" name="service" className={inputClass}>
            <option value="">Tanlang...</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Boshqa">Boshqa</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
            Loyiha haqida <span className="text-brand-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            rows={4}
            placeholder="G'oyangiz yoki loyihangiz haqida qisqacha yozing..."
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Yuborilmoqda..." : "Xabar yuborish"}
        {status !== "loading" && <Icon name="arrow" size={18} />}
      </Button>
      <p className="mt-3 text-center text-xs text-muted">
        Yuborish orqali siz bilan bog&apos;lanishimizga rozilik bildirasiz.
      </p>
    </form>
  );
}
