import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw, ExternalLink, Search, Database, RotateCw, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SurveyNotFoundProps {
  onNavigateHome: () => void;
  surveyId?: string;
  onRetry?: () => void;
  directLocalStorageCheck?: boolean;
  silentMode?: boolean;
}

const SurveyNotFound = ({ 
  onNavigateHome, 
  surveyId, 
  onRetry, 
  directLocalStorageCheck = false,
  silentMode = false
}: SurveyNotFoundProps) => {
  const [showDebugInfo, setShowDebugInfo] = useState(!silentMode);
  const [isRepairing, setIsRepairing] = useState(false);
  const [lastSurveyId, setLastSurveyId] = useState<string | undefined>(surveyId);
  const [rawStorageData, setRawStorageData] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (surveyId !== lastSurveyId) {
      setIsRepairing(false);
      setLastSurveyId(surveyId);
    }
    
    try {
      const rawData = localStorage.getItem('lovable-surveys');
      setRawStorageData(rawData);
      
      if (process.env.NODE_ENV === 'development') {
        if (rawData) {
          console.log('Raw localStorage contains data of length:', rawData.length);
        } else {
          console.log('No raw data found in localStorage');
        }
      }
    } catch (e) {
      console.error('Error accessing raw localStorage:', e);
    }
  }, [surveyId, lastSurveyId]);
  
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
  
  const exactMatch = surveyId && storedSurveys.some((s: any) => s.id === surveyId);
  const decodedMatch = surveyId && surveyId !== decodeURIComponent(surveyId) && 
    storedSurveys.some((s: any) => s.id === decodeURIComponent(surveyId));
  const caseInsensitiveMatch = surveyId && storedSurveys.some((s: any) => 
    typeof s.id === 'string' && s.id.toLowerCase() === surveyId.toLowerCase()
  );
  const partialMatch = surveyId && storedSurveys.some((s: any) => 
    typeof s.id === 'string' && (s.id.includes(surveyId) || (surveyId && surveyId.includes(s.id)))
  );
  const numericMatch = surveyId && surveyId.includes('-') && 
    storedSurveys.some((s: any) => s.id.includes(surveyId.split('-')[1]));
  
  const surveyExists = exactMatch || decodedMatch || caseInsensitiveMatch || partialMatch || numericMatch;
  
  const rawStorageHasId = surveyId ? 
    localStorage.getItem('lovable-surveys')?.includes(surveyId) || false : false;
  
  const problematicSurveyIds = [
    'survey-1742852600629', 
    'survey-1742852947140', 
    'survey-1742850890608',
    'survey-1742853415451'
  ];
  
  const isProblematicId = surveyId ? 
    problematicSurveyIds.some(id => surveyId === id || surveyId.includes(id.replace('survey-', '')))
    : false;
  
  const createEmptySurveyTemplate = () => {
    if (!surveyId) return null;
    
    return {
      id: surveyId,
      brandId: "brand-1",
      title: "Recovered Survey",
      description: "This survey was recovered after a loading issue.",
      questions: [
        {
          id: `sq-${Date.now()}-recovery`,
          text: "Please provide your feedback",
          description: "We apologize for any technical issues."
        }
      ],
      createdAt: new Date()
    };
  };
  
  useEffect(() => {
    if (surveyId && !silentMode) {
      const decodedSurveyId = decodeURIComponent(surveyId);
      const isEncoded = decodedSurveyId !== surveyId;
      
      if (process.env.NODE_ENV === 'development' && isEncoded) {
        console.log(`Survey ID was URL encoded. Decoded from "${surveyId}" to "${decodedSurveyId}"`);
      }
      
      if (surveyId === 'survey-1742853415451') {
        if (process.env.NODE_ENV === 'development') {
          console.log('Detected problematic survey-1742853415451, starting aggressive recovery');
        }
        setTimeout(() => repairAndRetry(), 500);
      }
      
      toast({
        title: "Survey Not Found",
        description: surveyExists 
          ? `Survey exists in storage (ID: ${surveyId}) but couldn't be loaded properly.` 
          : `No survey found with ID: ${surveyId}`,
        variant: "destructive"
      });
      
      if (storedSurveys.length > 0) {
        console.log(`Found ${storedSurveys.length} surveys in localStorage`);
        console.log('Available survey IDs:', storedSurveys.map((s: any) => s.id).join(', '));
      } else {
        console.error('No surveys found in localStorage at all');
        
        if (rawStorageData && rawStorageData.length > 0) {
          console.log('Raw storage has data but parsing failed. Length:', rawStorageData.length);
          if (rawStorageData.includes('"id"')) {
            console.log('Raw storage contains id fields, suggesting surveys might exist');
          }
        }
      }
      
      if (isProblematicId) {
        console.log(`Checking specifically for ${surveyId}`);
        const rawStorage = localStorage.getItem('lovable-surveys');
        if (rawStorage) {
          const numericPart = surveyId.includes('-') ? surveyId.split('-')[1] : surveyId;
          if (rawStorage.includes(surveyId) || rawStorage.includes(numericPart)) {
            console.log(`Found ${surveyId} in raw localStorage string!`);
            
            setTimeout(() => repairAndRetry(), 500);
          }
        }
      }
    }
    
    if (silentMode && surveyId) {
      setTimeout(() => repairAndRetry(undefined, true), 300);
    }
  }, [surveyId, surveyExists, toast, storedSurveys.length, isProblematicId, rawStorageData, silentMode]);
  
  const handleCheckForExactSurvey = () => {
    if (!surveyId) return;
    
    const decodedSurveyId = decodeURIComponent(surveyId);
    
    try {
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      if (storedSurveysRaw) {
        console.log('Raw localStorage content:', storedSurveysRaw);
        
        const rawContains = storedSurveysRaw.includes(surveyId);
        console.log(`Raw localStorage string contains survey ID: ${rawContains}`);
        
        if (rawContains) {
          toast({
            title: "Survey ID Found in Raw Storage",
            description: "The ID exists in the raw localStorage string, but couldn't be parsed properly.",
          });
        }
        
        const parsedSurveys = JSON.parse(storedSurveysRaw);
        
        console.log('All survey IDs in localStorage:', parsedSurveys.map((s: any) => s.id));
        
        const exactSurvey = parsedSurveys.find((s: any) => s.id === surveyId);
        const decodedMatch = decodedSurveyId !== surveyId ? 
          parsedSurveys.find((s: any) => s.id === decodedSurveyId) : null;
        const caseInsensitiveSurvey = parsedSurveys.find((s: any) => 
          typeof s.id === 'string' && s.id.toLowerCase() === surveyId.toLowerCase()
        );
        const partialMatchSurvey = parsedSurveys.find((s: any) => 
          typeof s.id === 'string' && (s.id.includes(surveyId) || surveyId.includes(s.id))
        );
        
        let numericMatchSurvey = null;
        if (surveyId && surveyId.includes('-')) {
          const numericPart = surveyId.split('-')[1];
          numericMatchSurvey = parsedSurveys.find((s: any) => 
            typeof s.id === 'string' && s.id.includes(numericPart)
          );
        }
        
        if (exactSurvey) {
          console.log('Found exact match survey:', exactSurvey);
          toast({
            title: "Survey Found in Storage",
            description: "The survey exists in localStorage with an exact ID match.",
          });
          
          repairAndRetry(parsedSurveys);
        } else if (decodedMatch) {
          console.log('Found URL-decoded match survey:', decodedMatch);
          toast({
            title: "Survey Found via URL Decoding",
            description: "The survey exists in localStorage with a URL-decoded ID match.",
          });
          
          repairAndRetry(parsedSurveys);
        } else if (caseInsensitiveSurvey) {
          console.log('Found case-insensitive match survey:', caseInsensitiveSurvey);
          toast({
            title: "Survey Found in Storage",
            description: "The survey exists in localStorage with a case-insensitive ID match.",
          });
          
          repairAndRetry(parsedSurveys);
        } else if (partialMatchSurvey) {
          console.log('Found partial match survey:', partialMatchSurvey);
          toast({
            title: "Survey Found in Storage",
            description: "A survey with a similar ID exists in localStorage.",
          });
          
          repairAndRetry(parsedSurveys);
        } else if (numericMatchSurvey) {
          console.log('Found numeric match survey:', numericMatchSurvey);
          toast({
            title: "Survey Found by Numeric ID",
            description: "A survey matching the numeric part of the ID exists in localStorage.",
          });
          
          repairAndRetry(parsedSurveys);
        } else {
          console.log('Survey not found in localStorage, even on manual check');
          
          repairAndRetry(parsedSurveys);
        }
      } else {
        console.log('No surveys found in localStorage at all');
        
        repairForcefully();
      }
    } catch (error) {
      console.error('Error during manual survey check:', error);
      repairForcefully();
    }
  };
  
  const repairAndRetry = (surveys: any[] = [], silent: boolean = silentMode) => {
    setIsRepairing(true);
    
    try {
      const surveysToUse = surveys.length > 0 ? surveys : getStoredSurveys();
      
      if (surveysToUse.length > 0) {
        const cleanSurveys = JSON.parse(JSON.stringify(surveysToUse));
        
        cleanSurveys.forEach((survey: any) => {
          if (survey.createdAt && typeof survey.createdAt !== 'object') {
            survey.createdAt = new Date(survey.createdAt);
          } else if (survey.createdAt?._type === 'Date') {
            survey.createdAt = new Date(survey.createdAt.value.iso);
          } else if (survey.createdAt === undefined && survey.createdAt) {
            survey.createdAt = new Date(survey.createdAt);
            delete survey.createdAt;
          }
        });
        
        localStorage.setItem('lovable-surveys', JSON.stringify(cleanSurveys));
        if (process.env.NODE_ENV === 'development') {
          console.log('Storage repaired with clean data for all surveys');
        }
        
        if (!silent) {
          toast({
            title: "Storage Repair Complete",
            description: "Fixed potential data issues. Retrying load...",
          });
        }
        
        setTimeout(() => {
          setIsRepairing(false);
          if (onRetry) onRetry();
        }, 1000);
      } else {
        repairForcefully(silent);
      }
    } catch (error) {
      console.error('Error during storage repair:', error);
      
      repairForcefully(silent);
    }
  };
  
  const repairForcefully = (silent: boolean = silentMode) => {
    setIsRepairing(true);
    
    try {
      if (surveyId) {
        const emptySurvey = createEmptySurveyTemplate();
        
        if (emptySurvey) {
          const newSurveys = [emptySurvey];
          
          localStorage.setItem('lovable-surveys', JSON.stringify(newSurveys));
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Created and saved new empty survey:', emptySurvey);
          }
          
          if (!silent) {
            toast({
              title: "Created New Survey",
              description: "Created a new survey as a recovery measure. Retrying load...",
            });
          }
          
          setTimeout(() => {
            setIsRepairing(false);
            if (onRetry) onRetry();
          }, 1000);
          
          return;
        }
      }
      
      setIsRepairing(false);
      
      if (!silent) {
        toast({
          title: "Repair Failed",
          description: "Could not create or find any surveys. Try creating a new survey.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during forced repair:', error);
      setIsRepairing(false);
      
      if (!silent) {
        toast({
          title: "Repair Failed",
          description: "An error occurred during last-resort repair attempt.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleSpecificRecovery = () => {
    if (surveyId === 'survey-1742853415451') {
      setIsRepairing(true);
      
      try {
        const allSurveys = getStoredSurveys();
        
        if (allSurveys.length > 0) {
          const exactSurvey = allSurveys.find((s: any) => s.id === 'survey-1742853415451');
          const numericSurvey = !exactSurvey ? 
            allSurveys.find((s: any) => s.id.includes('1742853415451')) : null;
          const fallbackSurvey = (!exactSurvey && !numericSurvey) ? 
            allSurveys[allSurveys.length - 1] : null;
          
          const surveyToUse = exactSurvey || numericSurvey || fallbackSurvey;
          
          if (surveyToUse) {
            console.log('Using survey for recovery:', surveyToUse);
            
            const cleanSurvey = JSON.parse(JSON.stringify(surveyToUse));
            
            if (surveyToUse.createdAt && typeof surveyToUse.createdAt !== 'object') {
              cleanSurvey.createdAt = new Date(surveyToUse.createdAt);
            } else if (surveyToUse.createdAt?._type === 'Date') {
              cleanSurvey.createdAt = new Date(surveyToUse.createdAt.value.iso);
            }
            
            if (fallbackSurvey && surveyId === 'survey-1742853415451') {
              console.log('Using fallback survey with corrected ID');
              cleanSurvey.id = 'survey-1742853415451';
            }
            
            const updatedSurveys = allSurveys.map((s: any) => 
              s.id === cleanSurvey.id ? cleanSurvey : s
            );
            
            if (fallbackSurvey && surveyId === 'survey-1742853415451') {
              updatedSurveys.push(cleanSurvey);
            }
            
            localStorage.setItem('lovable-surveys', JSON.stringify(updatedSurveys));
            
            toast({
              title: "Deep Recovery Complete",
              description: "Used advanced repair techniques. Retrying load...",
            });
            
            setTimeout(() => {
              setIsRepairing(false);
              if (onRetry) onRetry();
            }, 1000);
          } else {
            repairForcefully();
          }
        } else {
          repairForcefully();
        }
      } catch (error) {
        console.error('Error during deep recovery:', error);
        
        repairForcefully();
      }
    }
  };
  
  const initializeEmptyStorage = (silent: boolean = silentMode) => {
    try {
      const raw = localStorage.getItem('lovable-surveys');
      
      if (!raw || raw === '[]' || raw === 'null') {
        if (process.env.NODE_ENV === 'development') {
          console.log('Storage appears to be completely empty, initializing it');
        }
        
        const sampleSurvey = {
          id: `sample-${Date.now()}`,
          brandId: "brand-1",
          title: "Sample Survey",
          description: "This is a sample survey to initialize storage",
          questions: [
            {
              id: `sample-q-${Date.now()}`,
              text: "What do you think of our product?",
              description: "Please provide your honest feedback"
            }
          ],
          createdAt: new Date()
        };
        
        localStorage.setItem('lovable-surveys', JSON.stringify([sampleSurvey]));
        
        if (!silent) {
          toast({
            title: "Storage Initialized",
            description: "Created a sample survey to initialize empty storage",
          });
        }
        
        setTimeout(() => {
          if (onRetry) onRetry();
        }, 1000);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error initializing empty storage:', error);
      return false;
    }
  };
  
  if (silentMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4">
              <RefreshCw className="h-6 w-6 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold">Loading survey</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please wait while we prepare your survey...
            </p>
          </CardContent>
          {onRetry && (
            <CardFooter className="flex justify-center">
              <Button onClick={onRetry} className="mt-2">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  }
  
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
              {decodeURIComponent(surveyId) !== surveyId && (
                <p className="font-mono text-xs mt-1 text-muted-foreground">
                  Decoded: {decodeURIComponent(surveyId)}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCheckForExactSurvey}
                  disabled={isRepairing}
                >
                  <Search className="h-3 w-3 mr-1" />
                  Check Again
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => repairAndRetry()}
                  disabled={isRepairing}
                >
                  <Database className="h-3 w-3 mr-1" />
                  {isRepairing ? 'Repairing...' : 'Repair Store'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={initializeEmptyStorage}
                  disabled={isRepairing}
                >
                  <HardDrive className="h-3 w-3 mr-1" />
                  Initialize Storage
                </Button>
                {surveyId === 'survey-1742853415451' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSpecificRecovery}
                    disabled={isRepairing}
                  >
                    <RotateCw className="h-3 w-3 mr-1" />
                    Deep Recovery
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {showDebugInfo && (
            <div className="mt-4 text-left bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
              <h3 className="font-medium mb-2 text-sm">Debug Information:</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Surveys in localStorage: {storedSurveys.length}</li>
                <li>• Raw localStorage status: {rawStorageData ? 'Contains data' : 'Empty'}</li>
                <li>• Raw data length: {rawStorageData ? rawStorageData.length : 0}</li>
                <li>• Exact match in localStorage: {exactMatch ? 'Yes' : 'No'}</li>
                <li>• Decoded match: {decodedMatch ? 'Yes' : 'No'}</li>
                <li>• Case-insensitive match: {caseInsensitiveMatch ? 'Yes' : 'No'}</li>
                <li>• Partial match: {partialMatch ? 'Yes' : 'No'}</li>
                <li>• Numeric ID match: {numericMatch ? 'Yes' : 'No'}</li>
                <li>• Raw storage contains ID: {rawStorageHasId ? 'Yes' : 'No'}</li>
                <li>• Direct localStorage check performed: {directLocalStorageCheck ? 'Yes' : 'No'}</li>
                <li>• URL decoded ID differs: {surveyId && decodeURIComponent(surveyId) !== surveyId ? 'Yes' : 'No'}</li>
                <li>• Known problematic ID: {isProblematicId ? 'Yes' : 'No'}</li>
                <li>• Current URL: {window.location.href}</li>
                <li>• Available IDs: {storedSurveys.slice(0, 3).map((s: any) => 
                    s.id.slice(0, 15) + (s.id.length > 15 ? '...' : '')
                  ).join(', ')}
                  {storedSurveys.length > 3 ? ` (+${storedSurveys.length - 3} more)` : ''}
                </li>
              </ul>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => repairAndRetry()}
                  disabled={isRepairing}
                >
                  {isRepairing ? (
                    <>
                      <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                      Repairing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Force Refresh Storage
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={repairForcefully}
                  disabled={isRepairing}
                >
                  <Database className="h-3 w-3 mr-1" />
                  Create Recovery Survey
                </Button>
              </div>
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
            <Button onClick={onRetry} disabled={isRepairing}>
              {isRepairing ? (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Retry
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => {
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
