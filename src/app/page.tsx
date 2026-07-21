import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Features } from "@/components/sections/Features";
import { Process } from "@/components/sections/Process";
import { ProjectsPreview } from "@/components/sections/ProjectsPreview";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Features />
      <Process />
      <ProjectsPreview />
      <Pricing />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  );
}
