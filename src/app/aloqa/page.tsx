import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aloqa",
  description:
    "Softizim bilan bog'laning. Loyihangizni muhokama qilish uchun bepul konsultatsiya oling.",
};

const contacts: {
  icon: IconName;
  label: string;
  value: string;
  href: string;
}[] = [
  { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "phone", label: "Telefon", value: site.phone, href: `tel:${site.phone}` },
  {
    icon: "telegram",
    label: "Telegram",
    value: "@softizim",
    href: site.social.telegram,
  },
  { icon: "mapPin", label: "Manzil", value: site.address, href: "#" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Aloqa"
        title="Keling, gaplashamiz"
        subtitle="Loyihangiz haqida qisqacha yozib qoldiring — 24 soat ichida javob beramiz."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold">Aloqa ma&apos;lumotlari</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Qulay usulda bog&apos;laning yoki formani to&apos;ldiring. Har
              qanday savolga javob berishdan xursandmiz.
            </p>
            <div className="mt-8 space-y-3">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-brand-300"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                    <Icon name={c.icon} size={20} />
                  </span>
                  <span>
                    <span className="block text-xs text-muted">{c.label}</span>
                    <span className="block text-sm font-medium">{c.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
