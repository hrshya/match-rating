import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { DossierPreview } from '@/components/home/DossierPreview';
import { FeatureGrid } from '@/components/home/FeatureGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black selection:bg-black selection:text-white pb-24 font-sans antialiased">
      <div className="max-w-5xl mx-auto px-6 pt-8 space-y-20">
        
        <Navbar />
        <Hero />
        <DossierPreview />
        <FeatureGrid />
        <Footer />
        
      </div>
    </div>
  );
}