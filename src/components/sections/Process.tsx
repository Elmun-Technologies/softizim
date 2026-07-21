import { Section, SectionHeader } from "@/components/ui/Section";
import { process } from "@/lib/site";

export function Process() {
  return (
    <Section id="jarayon">
      <SectionHeader
        eyebrow="Ishlash jarayoni"
        title="Loyiha qanday amalga oshadi"
        subtitle="Shaffof va bosqichma-bosqich — har qadamda natijani ko'rasiz."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {process.map((p, i) => (
          <div key={p.step} className="relative">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-brand-500/40">
                {p.step}
              </span>
              {i < process.length - 1 && (
                <span className="hidden h-px flex-1 bg-gradient-to-r from-brand-300 to-transparent lg:block" />
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
