import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { NoticeBoard } from "@/components/landing/NoticeBoard";
import { Pricing } from "@/components/landing/Pricing";
import { Showcase } from "@/components/landing/Showcase";
import { TechStack } from "@/components/landing/TechStack";
import "./landing-page.css";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <TechStack />
        <Features />
        <Showcase />
        <NoticeBoard />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
