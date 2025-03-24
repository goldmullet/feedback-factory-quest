
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Question from '@/components/Question';

interface SurveyCreationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSurvey: (title: string, description: string, questions: {text: string, description: string}[]) => void;
}

const SurveyCreation = ({ open, onOpenChange, onCreateSurvey }: SurveyCreationProps) => {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyQuestions, setSurveyQuestions] = useState<{text: string, description: string}[]>([
    {text: '', description: ''}
  ]);
  
  const { toast } = useToast();

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
    // Validate survey title
    if (!surveyTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your survey.",
        variant: "destructive"
      });
      return;
    }

    // Filter out questions with empty text
    const validQuestions = surveyQuestions.filter(q => q.text.trim() !== '');
    
    // Check if there are any valid questions
    if (validQuestions.length === 0) {
      toast({
        title: "Missing questions",
        description: "Please add at least one question with text to your survey.",
        variant: "destructive"
      });
      return;
    }

    // Create survey with valid questions only
    onCreateSurvey(surveyTitle, surveyDescription, validQuestions);

    // Reset form
    setSurveyTitle('');
    setSurveyDescription('');
    setSurveyQuestions([{text: '', description: ''}]);
    
    // Close dialog
    onOpenChange(false);
    
    // Show success toast
    toast({
      title: "Survey created",
      description: "Your survey has been created successfully."
    });
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
