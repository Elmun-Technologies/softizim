import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { features } from "@/lib/site";

export function Features() {
  return (
    <Section id="afzalliklar" className="bg-subtle/50">
      <SectionHeader
        eyebrow="Nega Softizim"
        title="Ishonchli hamkor bo'lamiz"
        subtitle="Biz shunchaki kod yozmaymiz — biznesingizning o'sishiga hissa qo'shamiz."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600">
              <Icon name={f.icon as IconName} size={22} />
            </span>
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
