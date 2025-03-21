
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { Survey } from '@/types';

interface SurveyListProps {
  surveys: Survey[];
  brandId: string;
  onCreateSurvey: () => void;
  onShareSurvey: (surveyId: string) => void;
}

const SurveyList = ({ surveys, brandId, onCreateSurvey, onShareSurvey }: SurveyListProps) => {
  const brandSurveys = surveys.filter(survey => survey.brandId === brandId);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Surveys</h2>
        <Button onClick={onCreateSurvey}>
          <Plus className="mr-2 h-4 w-4" /> Create New Survey
        </Button>
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  View Responses
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
