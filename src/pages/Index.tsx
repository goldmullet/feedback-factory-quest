
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, Rocket, BarChart, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-blue-950 -z-10" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
              Voice Feedback for <span className="text-primary">E-commerce</span> Brands
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Collect authentic customer feedback through voice recordings. 
              Gain insights, reduce returns, and reward your customers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/brand/setup" className="flex items-center">
                  Get Started
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToFeatures} className="border-2">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent" />
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-slate-950" ref={featuresRef}>
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple three-step process to start collecting valuable feedback today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-effect p-8 rounded-xl card-hover">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                <Rocket className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Set Up Questions</h3>
              <p className="text-muted-foreground">
                Create targeted questions for different customer scenarios like returns or cancellations.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="glass-effect p-8 rounded-xl card-hover">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                <Mic className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Collect Voice Feedback</h3>
              <p className="text-muted-foreground">
                Customers record their authentic feedback and thoughts about their experience.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="glass-effect p-8 rounded-xl card-hover">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                <BarChart className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gain Actionable Insights</h3>
              <p className="text-muted-foreground">
                Our AI analyzes the feedback, highlighting key issues and opportunities for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Customer Rewards That Increase Response Rates</h2>
              <p className="text-muted-foreground mb-8">
                Incentivize your customers to share valuable feedback by offering store credit. Higher response rates mean better insights for your business.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 mt-1 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium">Increased Response Rates</h4>
                    <p className="text-muted-foreground">Store credit incentives drive up to 3x more customer responses.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 mt-1 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium">Customer Re-engagement</h4>
                    <p className="text-muted-foreground">Turn negative experiences into second chances with your brand.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500 mt-1 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium">Seamless Integration</h4>
                    <p className="text-muted-foreground">Connects with your Shopify, WooCommerce or custom store.</p>
                  </div>
                </div>
              </div>
              <Button className="mt-8 bg-primary hover:bg-primary/90">
                <Link to="/brand/setup">Start Rewarding Feedback</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="glass-effect rounded-xl p-6 shadow-card">
                <div className="flex items-center mb-6">
                  <CreditCard className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-semibold">Store Credit Reward</h3>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-foreground/90">
                    Thank you for your feedback! Here's your reward:
                  </p>
                  <div className="text-3xl font-bold text-primary mt-2">$10 Store Credit</div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Use code <span className="font-semibold">FEEDBACK10</span> at checkout or click below to shop now.
                </p>
                <Button className="w-full">Redeem Now</Button>
              </div>
              <div className="absolute -z-10 top-6 right-6 bottom-6 left-6 rounded-xl bg-primary/20 blur-xl" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Collecting Voice Feedback Today
            </h2>
            <p className="mb-8 text-primary-foreground/90 text-lg">
              Join leading e-commerce brands using voice feedback to improve their products and reduce returns.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-primary-foreground/90">
              <Link to="/brand/setup">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
