import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";

export function Cta() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(34,211,238,0.6), transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Loyihangizni bugun boshlaymizmi?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-100">
              Bepul konsultatsiya oling — g&apos;oyangizni muhokama qilamiz va
              aniq taklif beramiz. Hech qanday majburiyat yo&apos;q.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/aloqa"
                size="lg"
                className="bg-white text-brand-700 hover:bg-brand-50"
              >
                Bepul konsultatsiya
                <Icon name="arrow" size={18} />
              </ButtonLink>
              <ButtonLink
                href={`mailto:${site.email}`}
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <Icon name="mail" size={18} />
                {site.email}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
