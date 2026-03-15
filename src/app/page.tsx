import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import dynamic from 'next/dynamic';

const Contact = dynamic(() =>
  import('@/components/landing/Contact').then((mod) => mod.Contact)
);

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
