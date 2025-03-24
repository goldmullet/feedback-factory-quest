
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Star } from 'lucide-react';
import { Survey } from '@/types';

interface SurveyIntroProps {
  survey: Survey;
  onContinue: () => void;
}

const SurveyIntro = ({ survey, onContinue }: SurveyIntroProps) => {
  return (
    <Card className="glass-effect">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 rounded-full p-4 mb-4">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl md:text-3xl">{survey.title}</CardTitle>
        {survey.description && (
          <CardDescription className="text-base mt-2">{survey.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted rounded-lg p-4">
          <h3 className="font-medium mb-2 flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            Earn Store Credit
          </h3>
          <p className="text-sm text-muted-foreground">
            By completing this survey, you'll earn store credit that can be used towards future purchases.
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Survey Details:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''} to answer</li>
            <li>• Takes approximately {survey.questions.length * 2} minutes to complete</li>
            <li>• Your feedback helps improve products and services</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">What happens next?</h3>
          <p className="text-sm text-muted-foreground">
            After submitting your answers, we'll ask for your name and email to credit your account.
            Your information will only be used for providing store credit and will not be shared with third parties.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onContinue} className="w-full">Begin Survey</Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyIntro;
