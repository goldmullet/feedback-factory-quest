
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SurveyThankYouProps {
  onNavigateHome: () => void;
}

const SurveyThankYou = ({ onNavigateHome }: SurveyThankYouProps) => {
  return (
    <Card className="glass-effect text-center">
      <CardHeader>
        <CardTitle>Thank You!</CardTitle>
        <CardDescription>
          Your feedback has been successfully submitted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-6">
          <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg mb-4">Your store credit has been earned!</p>
          <p className="text-muted-foreground">
            Thank you for sharing your thoughts. Your feedback helps our partners improve their products and services.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" onClick={onNavigateHome}>Return Home</Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyThankYou;
