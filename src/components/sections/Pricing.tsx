import { Section, SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { plans } from "@/lib/site";

export function Pricing() {
  return (
    <Section id="narxlar">
      <SectionHeader
        eyebrow="Narxlar"
        title="Loyihangizga mos tarif"
        subtitle="Aniq narx loyiha talablariga bog'liq. Quyidagilar boshlang'ich yo'nalish uchun."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-8 shadow-soft ${
              plan.popular
                ? "border-brand-400 bg-card shadow-glow"
                : "border-border bg-card"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                Ommabop
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-2 text-sm text-muted">{plan.description}</p>
            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight">
                {plan.price}
              </span>
              <span className="text-sm text-muted">{plan.period}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Icon
                    name="check"
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-500"
                  />
                  <span className="text-muted">{f}</span>
                </li>
              ))}
            </ul>
            <ButtonLink
              href="/aloqa"
              variant={plan.popular ? "primary" : "outline"}
              className="mt-8 w-full"
            >
              {plan.cta}
            </ButtonLink>
          </div>
        ))}
      </div>
    </Section>
  );
}
