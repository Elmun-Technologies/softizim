import Link from "next/link";
import type { Project } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/loyihalar#${project.slug}`}
      id={project.slug}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow scroll-mt-24"
    >
      <div
        className="relative h-44 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${project.accent}, ${project.accent}22)`,
        }}
      >
        <div className="absolute inset-0 grid-bg opacity-40" />
        <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {project.category}
        </span>
        <span className="absolute right-5 top-5 text-sm font-semibold text-white/80">
          {project.year}
        </span>
        <span className="absolute bottom-5 left-5 text-2xl font-bold text-white">
          {project.title}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex-1 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-subtle px-2.5 py-1 text-xs text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
          Loyihani ko&apos;rish
          <Icon
            name="arrowUpRight"
            size={16}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
