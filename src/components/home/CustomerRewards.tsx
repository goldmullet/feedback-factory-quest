
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CreditCard, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomerRewards = () => {
  const benefits = [
    {
      title: "Increased Response Rates",
      description: "Store credit incentives drive up to 3x more customer responses."
    },
    {
      title: "Customer Re-engagement",
      description: "Turn negative experiences into second chances with your brand."
    },
    {
      title: "Seamless Integration",
      description: "Connects with your Shopify, WooCommerce or custom store."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-800">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Customer Rewards That Increase Response Rates</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
              Incentivize your customers to share valuable feedback by offering store credit. Higher response rates mean better insights for your business.
            </p>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 mt-1.5 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold">{benefit.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-10 bg-blue-600 hover:bg-blue-700 text-lg h-14 px-8 rounded-full">
              <Link to="/brand/setup" className="flex items-center gap-2">
                Start Rewarding Feedback <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-8">
                <CreditCard className="h-10 w-10 text-blue-600 mr-4" />
                <h3 className="text-2xl font-bold">Store Credit Reward</h3>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mb-8">
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Thank you for your feedback! Here's your reward:
                </p>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-3">$10 Store Credit</div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
                Use code <span className="font-semibold">FEEDBACK10</span> at checkout or click below to shop now.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-14 rounded-lg">Redeem Now</Button>
            </div>
            <div className="absolute -z-10 top-8 right-8 bottom-8 left-8 rounded-xl bg-blue-600/20 blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CustomerRewards;
