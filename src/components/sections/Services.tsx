import { Section, SectionHeader } from "@/components/ui/Section";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { services } from "@/lib/site";

export function Services() {
  return (
    <Section id="xizmatlar">
      <SectionHeader
        eyebrow="Xizmatlar"
        title="Biz nima qila olamiz"
        subtitle="G'oyadan tortib ishga tushirishgacha — mahsulotingizning har bir bosqichida yoningizdamiz."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </Section>
  );
}
