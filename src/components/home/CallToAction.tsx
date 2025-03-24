
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
      <div className="container-custom">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Start Collecting Voice Feedback Today
          </h2>
          <p className="mb-10 text-white/90 text-xl leading-relaxed">
            Join leading e-commerce brands using voice feedback to improve their products and reduce returns.
          </p>
          <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-white/90 border-0 text-lg h-14 px-8 rounded-full">
            <Link to="/brand/setup" className="flex items-center gap-2">
              Get Started for Free <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
