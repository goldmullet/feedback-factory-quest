
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Bot, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AutomatedFeedback = () => {
  const features = [
    {
      title: "Perfect Timing",
      description: "AI determines the optimal time to request feedback based on customer behavior patterns."
    },
    {
      title: "ESP Integration",
      description: "Works with your existing email service provider like Mailchimp, Klaviyo, or Sendgrid."
    },
    {
      title: "Automated Workflows",
      description: "Set up triggers based on purchases, returns, or subscription changes."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative z-10 bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Mail className="h-8 w-8 text-blue-600 mr-4" />
                  <h3 className="text-xl font-bold">Perfect Timing Email</h3>
                </div>
                <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full">Automated</span>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Subject</p>
                  <p className="font-medium">We'd love to hear your thoughts on your recent purchase</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Content</p>
                  <p className="font-medium mb-3">Hi [Customer],</p>
                  <p className="mb-3">We noticed you purchased [Product] recently. We'd love to hear your feedback!</p>
                  <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 p-3 rounded-lg font-medium text-center mb-3">
                    Record Voice Feedback
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your thoughts help us improve - and you'll get $10 store credit!</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">AI optimized timing</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Automated triggers</span>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 top-8 right-8 bottom-8 left-8 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">AI Automated Feedback</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
              Seamlessly connect to your ESP to send triggered messages at the perfect time for feedback. Let AI determine when customers are most likely to respond.
            </p>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 mt-1.5 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold">{feature.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-10 bg-blue-600 hover:bg-blue-700 text-lg h-14 px-8 rounded-full">
              <Link to="/brand/setup" className="flex items-center gap-2">
                Connect Your ESP <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AutomatedFeedback;
