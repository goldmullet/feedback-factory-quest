
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface SurveyNotFoundProps {
  onNavigateHome: () => void;
  surveyId?: string;
  onRetry?: () => void;
}

const SurveyNotFound = ({ onNavigateHome, surveyId, onRetry }: SurveyNotFoundProps) => {
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
          <p className="text-muted-foreground mb-4">
            The survey you're looking for doesn't exist or has been removed.
          </p>
          {surveyId && (
            <div className="bg-muted p-3 rounded-md mb-6 text-sm overflow-hidden">
              <p className="font-mono overflow-ellipsis overflow-hidden">ID: {surveyId}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={onNavigateHome}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SurveyNotFound;
