
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PackageX, Star, Zap, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AITriggeredEvents = () => {
  const triggerEvents = [
    {
      title: "Returned Product",
      description: "Instantly find out why customers have returned products and address issues proactively.",
      icon: <PackageX className="h-10 w-10 text-red-500" />,
      timing: "Immediately after return is processed"
    },
    {
      title: "Product Feedback",
      description: "Get real-time feedback on new products and understand exactly how to improve them.",
      icon: <Star className="h-10 w-10 text-amber-500" />,
      timing: "14 days after purchase"
    },
    {
      title: "Subscription Cancellation",
      description: "As soon as someone cancels a subscription, understand why and what you can do to improve.",
      icon: <Zap className="h-10 w-10 text-purple-500" />,
      timing: "Immediately after cancellation"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">AI Triggered Events</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            We'll send feedback requests at the perfect time, automatically, based on customer behavior and AI-determined optimal moments.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {triggerEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">{event.icon}</div>
                    
                    <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.timing}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg h-auto">
            <Link to="/brand/setup" className="flex items-center gap-2">
              Start Capturing Feedback <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            Set up in minutes. No credit card required to start.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AITriggeredEvents;
