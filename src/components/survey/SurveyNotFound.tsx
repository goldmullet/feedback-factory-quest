
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';
import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

interface SurveyNotFoundProps {
  onNavigateHome: () => void;
  onRetry: () => void;
  surveyId?: string;
  directLocalStorageCheck?: boolean;
  silentMode?: boolean;
  onForceRecovery?: () => void;
}

const SurveyNotFound = ({
  onNavigateHome,
  onRetry,
  surveyId,
  directLocalStorageCheck,
  silentMode = false,
  onForceRecovery
}: SurveyNotFoundProps) => {
  // Wrapper functions to handle React mouse events
  const handleRetry = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onRetry();
  };

  const handleForceRecovery = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onForceRecovery?.();
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
      <CardFooter className="flex flex-col gap-4">
        <div className="flex gap-4 w-full justify-center">
          <Button 
            variant="outline" 
            onClick={onNavigateHome}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Button>
          <Button 
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        </div>
        
        {onForceRecovery && (
          <Button 
            variant="secondary"
            onClick={handleForceRecovery}
            className="flex items-center gap-2 w-full"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Try Emergency Recovery</span>
          </Button>
        )}
        
        <div className="w-full text-center mt-2">
          <Link to="/brand/dashboard" className="text-primary text-sm flex items-center gap-1 justify-center hover:underline">
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SurveyNotFound;
