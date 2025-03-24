
import { motion } from 'framer-motion';
import { Rocket, Mic, BarChart } from 'lucide-react';

const HowItWorks = ({ forwardedRef }: { forwardedRef: React.RefObject<HTMLDivElement> }) => {
  const steps = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Set Up Questions",
      description: "Create targeted questions for different customer scenarios like returns or cancellations."
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Collect Voice Feedback",
      description: "Customers record their authentic feedback and thoughts about their experience."
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Gain Actionable Insights",
      description: "Our AI analyzes the feedback, highlighting key issues and opportunities for improvement."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900" ref={forwardedRef}>
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              A simple three-step process to start collecting valuable feedback today
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-6">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
