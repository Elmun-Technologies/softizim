import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Cta } from "@/components/sections/Cta";
import { projects } from "@/lib/site";

export const metadata: Metadata = {
  title: "Loyihalar",
  description:
    "Softizim tomonidan ishlab chiqilgan loyihalar: SaaS platformalar, marketplace, mobil ilovalar va fintech yechimlari.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        breadcrumb="Loyihalar"
        title="Loyihalarimiz"
        subtitle="Turli sohalarda ishga tushirilgan mahsulotlar. Har biri real biznes muammosini hal qiladi."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
