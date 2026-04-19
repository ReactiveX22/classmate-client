import { CTA } from '@/components/landing/CTA';
import { Features } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { NoticeBoard } from '@/components/landing/NoticeBoard';
import { RoleTabs } from '@/components/landing/RoleTabs';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1'>
        <Hero />
        <Features />
        <RoleTabs />
        <NoticeBoard />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}