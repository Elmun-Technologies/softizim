import { Section, SectionHeader } from "@/components/ui/Section";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { projects } from "@/lib/site";

export function ProjectsPreview() {
  return (
    <Section id="loyihalar" className="bg-subtle/50">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeader
          center={false}
          eyebrow="Portfolio"
          title="So'nggi loyihalar"
          subtitle="Turli sohalarda ishga tushirilgan mahsulotlarimizdan namunalar."
        />
        <ButtonLink href="/loyihalar" variant="outline" size="sm">
          Barchasi
          <Icon name="arrow" size={16} />
        </ButtonLink>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </Section>
  );
}
