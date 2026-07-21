import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Cta } from "@/components/sections/Cta";
import { stats, team } from "@/lib/site";

export const metadata: Metadata = {
  title: "Biz haqimizda",
  description:
    "Softizim — O'zbekistonda bizneslar uchun zamonaviy dasturiy yechimlar yaratuvchi jamoa. Bizning missiyamiz va qadriyatlarimiz.",
};

const values: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "sparkles",
    title: "Sifat",
    text: "Har bir mahsulotni o'zimizniki kabi qilib, mukammallikka intilib quramiz.",
  },
  {
    icon: "shield",
    title: "Ishonch",
    text: "Ochiq muloqot va shaffof jarayon — mijoz doimo nima bo'layotganini biladi.",
  },
  {
    icon: "rocket",
    title: "Tezlik",
    text: "Chaqqon uslubda ishlaymiz va natijani imkon qadar tez yetkazamiz.",
  },
  {
    icon: "cpu",
    title: "Innovatsiya",
    text: "Eng so'nggi texnologiyalarni o'rganib, mijozlarga zamonaviy yechim beramiz.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="Biz haqimizda"
        title="Biz Softizim jamoasimiz"
        subtitle="Elmun Technologies tarkibidagi dasturiy injiniring studiyasi. Biz g'oyalarni ishlaydigan mahsulotlarga aylantiramiz."
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              center={false}
              eyebrow="Bizning yo'limiz"
              title="Kichik jamoadan ishonchli hamkorgacha"
            />
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              <p>
                Softizim bir necha muhandisning oddiy maqsadi bilan boshlandi:
                O&apos;zbekistondagi bizneslarga xalqaro darajadagi dasturiy
                yechimlarni yetkazish.
              </p>
              <p>
                Bugun biz startaplardan yirik korxonalargacha bo&apos;lgan
                mijozlar bilan ishlaymiz. Veb, mobil va bulutli texnologiyalarda
                mutaxassismiz va har bir loyihaga biznes hamkor sifatida
                yondashamiz.
              </p>
              <p>
                Bizning maqsadimiz — shunchaki dastur yozish emas, balki
                mijozning biznesini o&apos;stiradigan mahsulot yaratish.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft"
              >
                <div className="text-3xl font-bold tracking-tight text-brand-600">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-subtle/50">
        <SectionHeader
          eyebrow="Qadriyatlar"
          title="Bizni harakatga keltiruvchi tamoyillar"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <Icon name={v.icon} size={22} />
              </span>
              <h3 className="mt-4 text-base font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Jamoa"
          title="Softizim ortidagi insonlar"
          subtitle="Turli sohalardagi mutaxassislar bir maqsad yo'lida — sifatli mahsulot yaratish uchun."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="group rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <span
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${member.accent}, ${member.accent}99)`,
                }}
              >
                {member.initials}
              </span>
              <h3 className="mt-5 text-base font-semibold">{member.name}</h3>
              <p className="mt-1 text-sm text-muted">{member.role}</p>
            </div>
          ))}
        </div>
      </Section>

      <Cta />
    </>
  );
}
