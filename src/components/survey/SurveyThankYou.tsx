
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Award, ArrowRight } from 'lucide-react';

interface SurveyThankYouProps {
  onNavigateHome: () => void;
}

const SurveyThankYou = ({ onNavigateHome }: SurveyThankYouProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect text-center">
        <CardHeader>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mx-auto"
          >
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription className="text-lg">
            Your feedback has been successfully submitted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-6 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-primary/10 rounded-lg p-4"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <Award className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-medium">Store Credit Earned!</h3>
              </div>
              <p className="text-muted-foreground">
                A $10 store credit has been applied to your account and will be available for your next purchase.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-muted-foreground">
                Your insights help our partners improve their products and services. We appreciate you taking the time to share your thoughts.
              </p>
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button 
              onClick={onNavigateHome} 
              className="gap-2"
            >
              Return Home
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SurveyThankYou;
