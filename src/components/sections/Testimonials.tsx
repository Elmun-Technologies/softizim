import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { testimonials } from "@/lib/site";

export function Testimonials() {
  return (
    <Section id="fikrlar" className="bg-subtle/50">
      <SectionHeader
        eyebrow="Mijozlar fikri"
        title="Ular biz bilan ishlashdi"
        subtitle="Ishonch — bizning eng katta natijamiz."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-soft"
          >
            <Icon name="quote" size={32} className="text-brand-500/30" />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-fg">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-semibold text-white">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <span>
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="block text-xs text-muted">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
