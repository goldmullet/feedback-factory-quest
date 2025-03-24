
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw, ExternalLink, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SurveyNotFoundProps {
  onNavigateHome: () => void;
  surveyId?: string;
  onRetry?: () => void;
  directLocalStorageCheck?: boolean;
}

const SurveyNotFound = ({ 
  onNavigateHome, 
  surveyId, 
  onRetry, 
  directLocalStorageCheck = false 
}: SurveyNotFoundProps) => {
  const [showDebugInfo, setShowDebugInfo] = useState(true);
  const { toast } = useToast();
  
  // Try to fetch stored surveys directly
  const getStoredSurveys = () => {
    try {
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      if (storedSurveysRaw) {
        return JSON.parse(storedSurveysRaw);
      }
    } catch (error) {
      console.error('Error parsing stored surveys:', error);
    }
    return [];
  };
  
  const storedSurveys = getStoredSurveys();
  
  // More thorough survey existence checks
  const exactMatch = surveyId && storedSurveys.some((s: any) => s.id === surveyId);
  const caseInsensitiveMatch = surveyId && storedSurveys.some((s: any) => 
    typeof s.id === 'string' && s.id.toLowerCase() === surveyId.toLowerCase()
  );
  const surveyExists = exactMatch || caseInsensitiveMatch;
  
  // Display a toast with survey info when component mounts
  useEffect(() => {
    if (surveyId) {
      toast({
        title: "Survey Not Found",
        description: surveyExists 
          ? `Survey exists in storage (ID: ${surveyId}) but couldn't be loaded properly.` 
          : `No survey found with ID: ${surveyId}`,
        variant: "destructive"
      });
    }
  }, [surveyId, surveyExists, toast]);
  
  const handleCheckForExactSurvey = () => {
    if (!surveyId) return;
    
    // Just to double-check, directly try to find the survey in localStorage
    try {
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      if (storedSurveysRaw) {
        const parsedSurveys = JSON.parse(storedSurveysRaw);
        
        // Log all survey IDs
        console.log('All survey IDs in localStorage:', parsedSurveys.map((s: any) => s.id));
        
        // Find the exact survey we're looking for
        const exactSurvey = parsedSurveys.find((s: any) => s.id === surveyId);
        const caseInsensitiveSurvey = parsedSurveys.find((s: any) => 
          typeof s.id === 'string' && s.id.toLowerCase() === surveyId.toLowerCase()
        );
        
        if (exactSurvey) {
          console.log('Found exact match survey:', exactSurvey);
          toast({
            title: "Survey Found in Storage",
            description: "The survey exists in localStorage with an exact ID match.",
          });
        } else if (caseInsensitiveSurvey) {
          console.log('Found case-insensitive match survey:', caseInsensitiveSurvey);
          toast({
            title: "Survey Found in Storage",
            description: "The survey exists in localStorage with a case-insensitive ID match.",
          });
        } else {
          console.log('Survey not found in localStorage, even on manual check');
          toast({
            title: "Survey Not Found",
            description: "The survey was not found in localStorage, even after manual checking.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error during manual survey check:', error);
    }
  };
  
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
            {surveyExists 
              ? "The survey exists in storage but couldn't be loaded properly. Try refreshing or clicking Retry below." 
              : "The survey you're looking for doesn't exist or has been removed."}
          </p>
          {surveyId && (
            <div className="bg-muted p-3 rounded-md mb-6 text-sm overflow-hidden">
              <p className="font-mono overflow-ellipsis overflow-hidden">ID: {surveyId}</p>
              <div className="mt-2 flex space-x-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCheckForExactSurvey}
                >
                  <Search className="h-3 w-3 mr-1" />
                  Check Again
                </Button>
              </div>
            </div>
          )}
          
          {showDebugInfo && (
            <div className="mt-4 text-left bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
              <h3 className="font-medium mb-2 text-sm">Debug Information:</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Surveys in localStorage: {storedSurveys.length}</li>
                <li>• Exact match in localStorage: {exactMatch ? 'Yes' : 'No'}</li>
                <li>• Case-insensitive match: {caseInsensitiveMatch ? 'Yes' : 'No'}</li>
                <li>• Direct localStorage check performed: {directLocalStorageCheck ? 'Yes' : 'No'}</li>
                <li>• Current URL: {window.location.href}</li>
                <li>• Available IDs: {storedSurveys.slice(0, 3).map((s: any) => 
                    s.id.slice(0, 15) + (s.id.length > 15 ? '...' : '')
                  ).join(', ')}
                  {storedSurveys.length > 3 ? ` (+${storedSurveys.length - 3} more)` : ''}
                </li>
              </ul>
            </div>
          )}
          
          <Button 
            variant="link" 
            className="text-xs mt-2" 
            onClick={() => setShowDebugInfo(!showDebugInfo)}
          >
            {showDebugInfo ? 'Hide' : 'Show'} Debug Info
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center gap-4">
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
          <Button 
            variant="outline" 
            onClick={() => {
              // Attempt to navigate to the dashboard
              window.location.href = '/brand/dashboard';
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SurveyNotFound;
