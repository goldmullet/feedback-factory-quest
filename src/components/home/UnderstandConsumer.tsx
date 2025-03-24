
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, ShoppingCart, MessageCircle, ArrowRight } from 'lucide-react';

const UnderstandConsumer = () => {
  const consumerBuckets = [
    {
      icon: <ShoppingBag className="h-10 w-10" />,
      title: "Why did they return product?",
      description: "Uncover the root causes behind product returns to improve product design and descriptions.",
      color: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Why did they Churn?",
      description: "Discover why customers cancel subscriptions or stop using your service.",
      color: "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
    },
    {
      icon: <ShoppingCart className="h-10 w-10" />,
      title: "Why do they not buy twice?",
      description: "Learn what's preventing customers from making repeat purchases.",
      color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
    },
    {
      icon: <MessageCircle className="h-10 w-10" />,
      title: "What makes them buy 3 times?",
      description: "Identify the factors that convert customers into loyal brand advocates.",
      color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-800">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Really Understand Your Consumer</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get actionable insights into your customer's decision-making process at every stage.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {consumerBuckets.map((bucket, index) => (
            <motion.div 
              key={index} 
              className="relative overflow-hidden rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-full ${bucket.color} mb-6`}>
                {bucket.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{bucket.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {bucket.description}
              </p>
              <Link 
                to="/brand/setup" 
                className="flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Collect feedback <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnderstandConsumer;
