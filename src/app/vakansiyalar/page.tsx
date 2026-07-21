import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { jobs, perks, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vakansiyalar",
  description:
    "Softizim jamoasiga qo'shiling. Frontend, backend va dizayn yo'nalishlari bo'yicha ochiq vakansiyalar.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        breadcrumb="Vakansiyalar"
        title="Jamoamizga qo'shiling"
        subtitle="Biz iste'dodli va ishtiyoqli insonlarni qidiramiz. Kelajakni birga quramiz."
      />

      <Section>
        <SectionHeader
          eyebrow="Nega Softizim"
          title="Bu yerda ishlash qanday"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <Icon name={p.icon as IconName} size={22} />
              </span>
              <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-subtle/50">
        <SectionHeader
          eyebrow="Ochiq o'rinlar"
          title="Hozirgi vakansiyalar"
          subtitle="Mos vakansiyani topmadingizmi? Baribir yozing — kelajak uchun ko'rib chiqamiz."
        />
        <div className="mx-auto mt-14 max-w-4xl space-y-4">
          {jobs.map((job) => (
            <div
              key={job.slug}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Tag icon="server">{job.type}</Tag>
                    <Tag icon="mapPin">{job.location}</Tag>
                    <Tag icon="sparkles">{job.level}</Tag>
                  </div>
                </div>
                <ButtonLink
                  href={`/aloqa?vakansiya=${job.slug}`}
                  size="sm"
                  className="shrink-0"
                >
                  Ariza topshirish
                  <Icon name="arrow" size={16} />
                </ButtonLink>
              </div>
              <p className="mt-4 leading-relaxed text-muted">{job.summary}</p>
              <div className="mt-5 border-t border-border pt-5">
                <p className="text-sm font-semibold">Talablar</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm">
                      <Icon
                        name="check"
                        size={16}
                        className="mt-0.5 shrink-0 text-brand-500"
                      />
                      <span className="text-muted">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted">
            Rezyumeingizni{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-brand-600 hover:underline"
            >
              {site.email}
            </a>{" "}
            manziliga yuboring.
          </p>
        </div>
      </Section>
    </>
  );
}

function Tag({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: IconName;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-3 py-1 text-xs font-medium text-muted">
      <Icon name={icon} size={13} />
      {children}
    </span>
  );
}
