
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw, ExternalLink } from 'lucide-react';

interface SurveyNotFoundProps {
  onNavigateHome: () => void;
  surveyId?: string;
  onRetry?: () => void;
}

const SurveyNotFound = ({ onNavigateHome, surveyId, onRetry }: SurveyNotFoundProps) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
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
  const surveyExists = surveyId && storedSurveys.some((s: any) => s.id === surveyId);
  
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
              ? "The survey exists in storage but couldn't be loaded properly." 
              : "The survey you're looking for doesn't exist or has been removed."}
          </p>
          {surveyId && (
            <div className="bg-muted p-3 rounded-md mb-6 text-sm overflow-hidden">
              <p className="font-mono overflow-ellipsis overflow-hidden">ID: {surveyId}</p>
            </div>
          )}
          
          {showDebugInfo && (
            <div className="mt-4 text-left bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
              <h3 className="font-medium mb-2 text-sm">Debug Information:</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Surveys in localStorage: {storedSurveys.length}</li>
                <li>• Survey IDs: {storedSurveys.map((s: any) => s.id).join(', ')}</li>
                <li>• Current URL: {window.location.href}</li>
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
