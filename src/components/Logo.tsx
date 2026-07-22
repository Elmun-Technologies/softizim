import { site } from "@/lib/site";

export function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.8)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 9l-3 3 3 3M18 9l3 3-3 3M14 6l-4 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withText && (
        <span className="text-lg font-bold tracking-tight">
          {site.name}
        </span>
      )}
    </span>
  );
}
