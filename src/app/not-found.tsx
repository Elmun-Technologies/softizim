import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="container-x relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <span className="gradient-text text-7xl font-bold sm:text-8xl">404</span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Sahifa topilmadi
        </h1>
        <p className="mt-3 max-w-md text-muted">
          Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan.
        </p>
        <ButtonLink href="/" className="mt-8">
          <Icon name="arrow" size={18} className="rotate-180" />
          Bosh sahifaga qaytish
        </ButtonLink>
      </div>
    </section>
  );
}
