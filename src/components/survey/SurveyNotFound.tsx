
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Home, RefreshCw, ArrowLeft, Wand, Bug } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { isProblematicSurveyId } from '@/utils/surveyRecoveryUtils';

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
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const isKnownProblemSurvey = surveyId ? isProblematicSurveyId(surveyId) : false;

  // Wrapper functions to handle React mouse events
  const handleRetry = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onRetry();
  };

  const handleForceRecovery = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onForceRecovery?.();
  };

  const toggleDiagnostics = () => {
    setShowDiagnostics(prev => !prev);
    if (!showDiagnostics) {
      // When enabling diagnostics, check localStorage
      console.log('Diagnostics enabled - checking localStorage for surveys');
      try {
        const storedSurveysRaw = localStorage.getItem('lovable-surveys');
        if (storedSurveysRaw) {
          const allSurveys = JSON.parse(storedSurveysRaw);
          console.log('Available survey IDs:', allSurveys.map((s: any) => s.id).join(', '));
          
          if (surveyId) {
            const surveyExists = allSurveys.some((s: any) => s.id === surveyId);
            console.log(`Survey ${surveyId} exists in localStorage: ${surveyExists}`);
            
            // Check for partial matches too
            const partialMatches = allSurveys.filter((s: any) => 
              s.id.includes(surveyId) || surveyId.includes(s.id)
            );
            if (partialMatches.length > 0) {
              console.log('Partial matches found:', partialMatches.map((s: any) => s.id).join(', '));
            }
          }
        } else {
          console.log('No surveys found in localStorage');
        }
      } catch (error) {
        console.error('Error checking localStorage:', error);
      }
    }
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
            {isKnownProblemSurvey && (
              <div className="mt-2 text-sm p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                <p className="font-medium">This is a known problematic survey ID</p>
                <p className="text-xs mt-1">Special recovery methods are available below</p>
              </div>
            )}
          </div>
        )}
        <Separator />
        <div className="space-y-2">
          <p className="text-center">
            The survey may have been deleted or the link might be incorrect.
          </p>
        </div>

        {showDiagnostics && (
          <div className="mt-4 text-xs p-3 bg-slate-100 dark:bg-slate-800 rounded-md font-mono overflow-auto max-h-40">
            <p className="font-medium mb-1">Diagnostics:</p>
            <p>Survey ID: {surveyId || 'none'}</p>
            <p>Direct localStorage check: {directLocalStorageCheck ? 'Yes' : 'No'}</p>
            <p>Known problem survey: {isKnownProblemSurvey ? 'Yes' : 'No'}</p>
          </div>
        )}
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
            <Wand className="h-4 w-4" />
            <span>Advanced Recovery</span>
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleDiagnostics}
          className="flex items-center gap-1 text-xs"
        >
          <Bug className="h-3 w-3" />
          {showDiagnostics ? 'Hide Diagnostics' : 'Show Diagnostics'}
        </Button>
        
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
