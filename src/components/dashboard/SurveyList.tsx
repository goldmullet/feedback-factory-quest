import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, MessageSquare, Link as LinkIcon, RefreshCw, BarChart } from 'lucide-react';
import { Survey } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SurveyListProps {
  surveys: Survey[];
  brandId: string;
  onCreateSurvey: () => void;
  onShareSurvey: (surveyId: string) => void;
}

const SurveyList = ({ surveys, brandId, onCreateSurvey, onShareSurvey }: SurveyListProps) => {
  const brandSurveys = surveys.filter(survey => survey.brandId === brandId);
  const { toast } = useToast();
  const [isRepairing, setIsRepairing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      if (!storedSurveysRaw || storedSurveysRaw === '[]' || storedSurveysRaw === 'null') {
        console.log('No surveys found in localStorage, initializing with current surveys');
        
        if (surveys.length > 0) {
          localStorage.setItem('lovable-surveys', JSON.stringify(surveys));
          console.log('Initialized localStorage with surveys from context');
        }
      } else if (surveys.length > 0) {
        const storedSurveys = JSON.parse(storedSurveysRaw);
        
        let needsUpdate = false;
        const surveyIds = storedSurveys.map((s: any) => s.id);
        
        for (const survey of surveys) {
          if (!surveyIds.includes(survey.id)) {
            needsUpdate = true;
            break;
          }
        }
        
        if (needsUpdate) {
          localStorage.setItem('lovable-surveys', JSON.stringify(surveys));
          console.log('Updated localStorage with missing surveys from context');
        }
      }
    } catch (error) {
      console.error('Error initializing localStorage:', error);
    }
  }, [surveys]);
  
  const repairSurveys = () => {
    setIsRepairing(true);
    
    try {
      if (surveys.length > 0) {
        const cleanSurveys = JSON.parse(JSON.stringify(surveys));
        
        cleanSurveys.forEach((survey: any) => {
          if (survey.createdAt && typeof survey.createdAt !== 'object') {
            survey.createdAt = new Date(survey.createdAt);
          } else if (survey.createdAt?._type === 'Date') {
            survey.createdAt = new Date(survey.createdAt.value.iso);
          }
        });
        
        localStorage.setItem('lovable-surveys', JSON.stringify(cleanSurveys));
        
        toast({
          title: "Storage Repaired",
          description: "Survey storage has been synchronized and repaired.",
        });
        
        console.log('Repaired and synchronized survey storage');
      } else {
        const storedSurveysRaw = localStorage.getItem('lovable-surveys');
        if (storedSurveysRaw && storedSurveysRaw !== '[]' && storedSurveysRaw !== 'null') {
          try {
            const storedSurveys = JSON.parse(storedSurveysRaw);
            if (storedSurveys.length > 0) {
              toast({
                title: "Storage Verified",
                description: `Found ${storedSurveys.length} surveys in storage.`,
              });
            }
          } catch (e) {
            localStorage.setItem('lovable-surveys', JSON.stringify([]));
            toast({
              title: "Storage Reset",
              description: "Storage was corrupted and has been reset.",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "No Surveys Found",
            description: "No surveys are available to repair. Try creating a new survey.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error repairing surveys:', error);
      toast({
        title: "Repair Failed",
        description: "An error occurred during storage repair.",
        variant: "destructive"
      });
    } finally {
      setIsRepairing(false);
    }
  };

  const handleViewResponses = (surveyId: string) => {
    navigate(`/survey-responses/${surveyId}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Surveys</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={repairSurveys} 
            disabled={isRepairing} 
            size="sm"
            className="mr-2"
          >
            {isRepairing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Repair Storage
          </Button>
          <Button onClick={onCreateSurvey}>
            <Plus className="mr-2 h-4 w-4" /> Create New Survey
          </Button>
        </div>
      </div>

      {brandSurveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandSurveys.map(survey => (
            <Card key={survey.id} className="glass-effect">
              <CardHeader>
                <CardTitle>{survey.title}</CardTitle>
                {survey.description && (
                  <CardDescription>{survey.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">{survey.questions.length}</span> questions
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Created:</span> {survey.createdAt.toLocaleDateString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
                  ID: {survey.id}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewResponses(survey.id)}
                >
                  <BarChart className="h-4 w-4 mr-2" /> View Responses
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onShareSurvey(survey.id)}
                >
                  <LinkIcon className="h-4 w-4 mr-2" /> Share
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-effect">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-primary/10 rounded-full p-4 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No surveys yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your first survey to collect targeted feedback from your customers.
            </p>
            <Button onClick={onCreateSurvey}>
              <Plus className="mr-2 h-4 w-4" /> Create New Survey
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SurveyList;
