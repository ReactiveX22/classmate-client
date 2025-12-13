import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Contact } from '@/components/landing/Contact';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import Header from '@/components/landing/Header';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1'>
        <Hero />
        <Features />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
