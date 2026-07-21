import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { stats } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.5), transparent 60%)",
        }}
      />
      <div className="container-x relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted backdrop-blur animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Yangi loyihalar uchun ochiqmiz
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl animate-fade-up">
            G&apos;oyangizni{" "}
            <span className="gradient-text">raqamli mahsulotga</span>{" "}
            aylantiramiz
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted animate-fade-up">
            Softizim — biznesingiz uchun veb, mobil va SaaS yechimlarini ishlab
            chiqadigan dasturiy injiniring studiyasi. G&apos;oyadan ishga
            tushirishgacha bir jamoa bilan.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up">
            <ButtonLink href="/aloqa" size="lg">
              Loyihani boshlash
              <Icon name="arrow" size={18} />
            </ButtonLink>
            <ButtonLink href="/loyihalar" size="lg" variant="outline">
              Loyihalarimiz
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold tracking-tight sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
