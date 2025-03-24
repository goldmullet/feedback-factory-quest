import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mic, Rocket, BarChart, CreditCard, ChevronRight, ArrowRight, ShoppingCart, Users, MessageCircle, ShoppingBag, Mail, Bot, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section - ListenLabs Style */}
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
              Hear What Your Customers Really Think
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
            
            {/* Preview Image - ListenLabs Style */}
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
      
      {/* Logos Section - ListenLabs Style */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-slate-500 dark:text-slate-400 text-lg">Trusted by innovative e-commerce brands</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {/* Replace with actual logos */}
            {['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4', 'Brand 5'].map((brand, index) => (
              <div key={index} className="h-8 flex items-center">
                <div className="text-slate-400 dark:text-slate-500 font-semibold">{brand}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works - ListenLabs Style */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900" ref={featuresRef}>
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
            {[
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
            ].map((step, index) => (
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
      
      {/* Understanding Your Consumer Section */}
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
            {[
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
            ].map((bucket, index) => (
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
      
      {/* AI Automated Feedback Section */}
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
                {[
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
                ].map((feature, index) => (
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
      
      {/* Benefits Section - ListenLabs Style */}
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
                {[
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
                ].map((benefit, index) => (
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
      
      {/* Call to Action - ListenLabs Style */}
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
      
      <Footer />
    </div>
  );
};

export default Index;
