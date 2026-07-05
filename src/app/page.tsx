import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { Newsletter } from "@/components/sections/newsletter";
import { ForecastWidget } from "@/components/forecast-widget";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion-primitives";
import { T } from "@/components/t";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Live, interactive forecast app */}
      <section id="forecast" className="container-page scroll-mt-24 py-20 sm:py-28">
        <SectionHeading
          eyebrow={<T k="forecast.eyebrow" />}
          title={<T k="forecast.title" />}
          description={<T k="forecast.desc" />}
        />
        <Reveal delay={0.1} className="mt-12">
          <ForecastWidget />
        </Reveal>
      </section>

      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Faq />
      <Newsletter />
    </>
  );
}
