import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Cta } from "@/components/sections/Cta";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Xizmatlar",
  description:
    "Softizim xizmatlari: veb va mobil ishlab chiqish, SaaS platformalar, UI/UX dizayn, AI integratsiya va DevOps.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Xizmatlar"
        title="Xizmatlarimiz"
        subtitle="Biznesingizni raqamlashtirish uchun to'liq texnologik yechimlar to'plami."
      />
      <Section>
        <div className="space-y-6">
          {services.map((service, i) => (
            <div
              key={service.slug}
              id={service.slug}
              className="grid scroll-mt-24 items-center gap-8 rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10 lg:grid-cols-2"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <Icon name={service.icon as IconName} size={28} />
                </span>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">
                  {service.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted">
                  {service.description}
                </p>
              </div>
              <ul className={`space-y-3 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 rounded-xl border border-border bg-subtle/50 px-4 py-3"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
                      <Icon name="check" size={16} />
                    </span>
                    <span className="text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
