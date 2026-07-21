import Link from "next/link";
import { nav, services, site } from "@/lib/site";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/ui/Icon";

const socials = [
  { name: "telegram" as const, href: site.social.telegram },
  { name: "github" as const, href: site.social.github },
  { name: "linkedin" as const, href: site.social.linkedin },
  { name: "instagram" as const, href: site.social.instagram },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-subtle/50">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-8">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {site.description}
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-brand-400 hover:text-brand-600"
                >
                  <Icon name={s.name} size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Xizmatlar</h3>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/xizmatlar#${s.slug}`}
                    className="text-sm text-muted transition-colors hover:text-fg"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Kompaniya</h3>
            <ul className="mt-4 space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-sm text-muted transition-colors hover:text-fg"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Aloqa</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2.5">
                <Icon name="mail" size={16} className="text-brand-500" />
                <a href={`mailto:${site.email}`} className="hover:text-fg">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="phone" size={16} className="text-brand-500" />
                <a href={`tel:${site.phone}`} className="hover:text-fg">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="mapPin" size={16} className="text-brand-500" />
                <span>{site.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Barcha huquqlar himoyalangan.
          </p>
          <p>
            Elmun Technologies tomonidan{" "}
            <span className="text-brand-500">❤</span> bilan yaratilgan.
          </p>
        </div>
      </div>
    </footer>
  );
}
