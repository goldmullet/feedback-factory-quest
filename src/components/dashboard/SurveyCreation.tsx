
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Question from '@/components/Question';
import { persistSurveyToLocalStorage } from '@/context/feedback/surveyUtils';

interface SurveyCreationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSurvey: (title: string, description: string, questions: {text: string, description: string}[]) => string;
}

const SurveyCreation = ({ open, onOpenChange, onCreateSurvey }: SurveyCreationProps) => {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyQuestions, setSurveyQuestions] = useState<{text: string, description: string}[]>([
    {text: '', description: ''}
  ]);
  
  const { toast } = useToast();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSurveyTitle('');
      setSurveyDescription('');
      setSurveyQuestions([{text: '', description: ''}]);
    }
  }, [open]);

  const handleAddQuestion = () => {
    setSurveyQuestions([...surveyQuestions, {text: '', description: ''}]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...surveyQuestions];
    newQuestions[index].text = value;
    setSurveyQuestions(newQuestions);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newQuestions = [...surveyQuestions];
    newQuestions[index].description = value;
    setSurveyQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    if (surveyQuestions.length > 1) {
      const newQuestions = [...surveyQuestions];
      newQuestions.splice(index, 1);
      setSurveyQuestions(newQuestions);
    }
  };

  const handleCreateSurvey = () => {
    // Log the current state for debugging
    console.log("Creating survey with:", { 
      title: surveyTitle, 
      description: surveyDescription, 
      questions: surveyQuestions 
    });
    
    // Validate survey title
    if (!surveyTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your survey.",
        variant: "destructive"
      });
      return;
    }

    // Filter out completely empty questions (both text and description are empty)
    const validQuestions = surveyQuestions.filter(q => q.text.trim().length > 0);
    
    // Ensure there's at least one valid question
    if (validQuestions.length === 0) {
      toast({
        title: "Missing questions",
        description: "Please add at least one question with non-empty text to your survey.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create survey with valid questions only
      const surveyId = onCreateSurvey(surveyTitle, surveyDescription, validQuestions);
      
      // Also save directly to localStorage as a backup to prevent loss
      try {
        const storedSurveysRaw = localStorage.getItem('lovable-surveys');
        if (storedSurveysRaw) {
          const allSurveys = JSON.parse(storedSurveysRaw);
          const createdSurvey = allSurveys.find((s: any) => s.id === surveyId);
          
          if (createdSurvey) {
            // Manually ensure the survey is saved to localStorage
            persistSurveyToLocalStorage(createdSurvey);
            console.log('Extra backup of survey saved to localStorage');
          }
        }
      } catch (e) {
        console.error('Error in backup survey save:', e);
      }
      
      // Show success toast
      toast({
        title: "Survey created",
        description: "Your survey has been created successfully."
      });
      
      // Reset form and close dialog
      setSurveyTitle('');
      setSurveyDescription('');
      setSurveyQuestions([{text: '', description: ''}]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating survey:", error);
      toast({
        title: "Error",
        description: "There was an error creating your survey. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogDescription>
            Design your custom survey with questions tailored to your specific needs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Survey Title</Label>
            <Input
              id="title"
              placeholder="Enter survey title"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Survey Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description about this survey"
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Questions</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddQuestion}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Question
              </Button>
            </div>

            {surveyQuestions.map((q, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={surveyQuestions.length <= 1}
                    onClick={() => handleRemoveQuestion(index)}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
                <Question
                  question={q.text}
                  description={q.description}
                  editable={true}
                  onQuestionChange={(value) => handleQuestionChange(index, value)}
                  onDescriptionChange={(value) => handleDescriptionChange(index, value)}
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateSurvey}>Create Survey</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyCreation;
