import Link from "next/link";
import { formatDate, type Post } from "@/lib/blog";
import { Icon } from "@/components/ui/Icon";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <div
        className="relative h-40 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${post.accent}, ${post.accent}22)`,
        }}
      >
        <div className="absolute inset-0 grid-bg opacity-40" />
        <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} daqiqa o&apos;qish</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug transition-colors group-hover:text-brand-600">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
          O&apos;qish
          <Icon
            name="arrow"
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
