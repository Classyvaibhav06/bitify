import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { ExperienceIntro } from "@/components/site/experience-intro";
import { DesktopExperience } from "@/components/site/desktop-experience";
import { MobileExperience } from "@/components/site/mobile-experience";
import { TvExperience } from "@/components/site/tv-experience";
import { Ecosystem } from "@/components/site/ecosystem";
import { Features } from "@/components/site/features";
import { Downloads } from "@/components/site/downloads";
import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />
      <main id="main" className="flex-1">
        <Hero />
        <ExperienceIntro />
        <DesktopExperience />
        <MobileExperience />
        <TvExperience />
        <Ecosystem />
        <Features />
        <Downloads />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
