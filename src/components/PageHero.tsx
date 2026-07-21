import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function PageHero({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.6), transparent 60%)",
        }}
      />
      <div className="container-x relative py-16 sm:py-20">
        <nav className="flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-fg">
            Bosh sahifa
          </Link>
          <Icon name="chevronDown" size={14} className="-rotate-90" />
          <span className="text-fg">{breadcrumb}</span>
        </nav>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
