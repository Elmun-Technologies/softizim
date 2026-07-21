import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/cards/PostCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatDate, getPost, posts, type BlogBlock } from "@/lib/blog";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Maqola topilmadi" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-10 text-2xl font-bold tracking-tight">{block.text}</h2>
      );
    case "p":
      return (
        <p className="mt-5 leading-relaxed text-muted">{block.text}</p>
      );
    case "ul":
      return (
        <ul className="mt-5 space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
                <Icon name="check" size={13} />
              </span>
              <span className="leading-relaxed text-muted">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="mt-8 border-l-4 border-brand-500 bg-subtle/60 px-6 py-4 text-lg font-medium italic">
          {block.text}
        </blockquote>
      );
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
        <div className="container-x relative py-14 sm:py-16">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-fg">
              Bosh sahifa
            </Link>
            <Icon name="chevronDown" size={14} className="-rotate-90" />
            <Link href="/blog" className="hover:text-fg">
              Blog
            </Link>
          </nav>
          <div className="mt-5 max-w-3xl">
            <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
              {post.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-semibold text-white">
                  S
                </span>
                {post.author}
              </span>
              <span aria-hidden>·</span>
              <span>{formatDate(post.date)}</span>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} daqiqa o&apos;qish</span>
            </div>
          </div>
        </div>
      </section>

      <article className="container-x max-w-3xl py-16">
        {post.content.map((block, i) => (
          <Block key={i} block={block} />
        ))}

        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-subtle/50 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-base font-semibold">Loyihangiz bormi?</p>
            <p className="mt-1 text-sm text-muted">
              G&apos;oyangizni muhokama qilamiz — bepul konsultatsiya.
            </p>
          </div>
          <ButtonLink href="/aloqa">
            Bog&apos;lanish
            <Icon name="arrow" size={18} />
          </ButtonLink>
        </div>
      </article>

      <section className="border-t border-border bg-subtle/40 py-16">
        <div className="container-x">
          <h2 className="text-2xl font-bold tracking-tight">
            Boshqa maqolalar
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
