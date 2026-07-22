"use client";

import { Icon } from "@/components/ui/Icon";

export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Mavzuni almashtirish"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg transition-colors hover:bg-subtle ${className ?? ""}`}
    >
      <Icon name="moon" size={18} className="dark:hidden" />
      <Icon name="sun" size={18} className="hidden dark:block" />
    </button>
  );
}
