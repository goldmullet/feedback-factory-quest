
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { MouseEvent } from 'react';

interface SurveyNotFoundProps {
  onNavigateHome: () => void;
  onRetry: () => void;
  surveyId?: string;
  directLocalStorageCheck?: boolean;
  silentMode?: boolean;
}

const SurveyNotFound = ({
  onNavigateHome,
  onRetry,
  surveyId,
  directLocalStorageCheck,
  silentMode = false
}: SurveyNotFoundProps) => {
  // Wrapper functions to handle React mouse events
  const handleRetry = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onRetry();
  };

  return (
    <Card className="max-w-lg mx-auto glass-effect">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
        </div>
        <CardTitle className="text-2xl">Survey Not Found</CardTitle>
        <CardDescription>
          We couldn't find the survey you're looking for.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!silentMode && surveyId && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Survey ID: {surveyId}</p>
          </div>
        )}
        <Separator />
        <div className="space-y-2">
          <p className="text-center">
            The survey may have been deleted or the link might be incorrect.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          onClick={onNavigateHome}
          className="flex items-center space-x-2"
        >
          <Home className="h-4 w-4" />
          <span>Go Home</span>
        </Button>
        <Button 
          onClick={handleRetry}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyNotFound;
