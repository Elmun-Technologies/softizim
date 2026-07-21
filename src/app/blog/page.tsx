import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";
import { PostCard } from "@/components/cards/PostCard";
import { Cta } from "@/components/sections/Cta";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Softizim blogi — mahsulot, muhandislik, dizayn va AI mavzularida foydali maqolalar va tajribalar.",
};

export default function BlogPage() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <PageHero
        breadcrumb="Blog"
        title="Blog va maqolalar"
        subtitle="Texnologiya, mahsulot va dizayn haqidagi tajribalarimiz bilan bo'lishamiz."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>
      <Cta />
    </>
  );
}
