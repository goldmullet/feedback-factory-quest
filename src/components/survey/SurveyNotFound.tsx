
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface SurveyNotFoundProps {
  onNavigateHome: () => void;
}

const SurveyNotFound = ({ onNavigateHome }: SurveyNotFoundProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto rounded-full bg-red-100 p-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Survey Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            The survey you're looking for doesn't exist or has been removed.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onNavigateHome}>Return Home</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SurveyNotFound;
