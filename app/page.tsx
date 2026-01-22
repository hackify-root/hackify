import { MatrixRain } from "@/components/matrix-rain";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <MatrixRain />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
