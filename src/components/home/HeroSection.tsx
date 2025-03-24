
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

interface HeroSectionProps {
  scrollToFeatures: () => void;
}

const HeroSection = ({ scrollToFeatures }: HeroSectionProps) => {
  return (
    <section className="pt-32 md:pt-40 pb-16 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 -z-10" />
      <div className="container-custom relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Want to Know Your Customer? Just Ask — and Listen.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
            Collect authentic customer feedback through voice recordings. 
            Gain insights, reduce returns, and reward your customers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg h-14 px-8 rounded-full">
              <Link to="/brand/setup" className="flex items-center gap-2">
                Get Started <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={scrollToFeatures} className="text-lg h-14 px-8 rounded-full border-2">
              Learn More
            </Button>
          </div>
          
          {/* Preview Image */}
          <div className="relative mt-16 rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 z-10" />
            <img 
              src="https://placehold.co/1200x670/f5f7ff/a6b4fc?text=FeedbackFactory+Dashboard" 
              alt="FeedbackFactory Preview" 
              className="w-full h-auto object-cover rounded-xl border border-slate-200 dark:border-slate-700"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
