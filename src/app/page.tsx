import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Showcase } from "@/components/site/showcase";
import { WordTicker } from "@/components/site/word-ticker";
import { Platforms } from "@/components/site/platforms";
import { Features } from "@/components/site/features";
import { Integrations } from "@/components/site/integrations";
import { Crew } from "@/components/site/crew";
import { Downloads } from "@/components/site/downloads";
import { Faq } from "@/components/site/faq";
import { PlatformHover } from "@/components/site/platform-hover";
import { CtaBanner } from "@/components/site/cta-banner";
import { Footer } from "@/components/site/footer";
import { ScrollWaveform } from "@/components/site/scroll-waveform";
import { PartyMode } from "@/components/site/party-mode";
import { CursorGlow } from "@/components/site/cursor-glow";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />
      <main id="main" className="flex-1">
        <Hero />
        <Showcase />
        <WordTicker />
        <Platforms />
        <Features />
        <Integrations />
        <Crew />
        <Downloads />
        <Faq />
        <PlatformHover />
        <CtaBanner />
      </main>
      <Footer />
      {/* the site is a player — scrolling seeks the waveform */}
      <ScrollWaveform />
      {/* the fun layer — disco on demand + a spotlight that follows you */}
      <PartyMode />
      <CursorGlow />
    </div>
  );
}
