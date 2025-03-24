
import { useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import BrandLogos from '@/components/home/BrandLogos';
import HowItWorks from '@/components/home/HowItWorks';
import UnderstandConsumer from '@/components/home/UnderstandConsumer';
import AutomatedFeedback from '@/components/home/AutomatedFeedback';
import CustomerRewards from '@/components/home/CustomerRewards';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection scrollToFeatures={scrollToFeatures} />
        <BrandLogos />
        <div id="how-it-works">
          <HowItWorks forwardedRef={howItWorksRef} />
        </div>
        <div id="features">
          <UnderstandConsumer forwardedRef={featuresRef} />
          <AutomatedFeedback />
          <CustomerRewards />
        </div>
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
