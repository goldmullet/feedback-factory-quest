
import React from 'react';
import { Button } from '@/components/ui/button';

interface SurveyNotFoundProps {
  onNavigateHome: () => void;
}

const SurveyNotFound = ({ onNavigateHome }: SurveyNotFoundProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Survey Not Found</h1>
      <p className="text-muted-foreground mb-6">The survey you're looking for doesn't exist or has been removed.</p>
      <Button onClick={onNavigateHome}>Return Home</Button>
    </div>
  );
};

export default SurveyNotFound;
