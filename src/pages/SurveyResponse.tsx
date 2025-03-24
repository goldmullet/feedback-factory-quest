
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeedback } from '@/context/feedback';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Question from '@/components/Question';
import SurveyIntro from '@/components/survey/SurveyIntro';

const SurveyResponse = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { surveys, addSurveyResponse } = useFeedback();
  
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'info', 'questions', 'thank-you'
  const [respondentInfo, setRespondentInfo] = useState({
    name: '',
    email: ''
  });
  const [answers, setAnswers] = useState<{questionId: string, answer: string}[]>([]);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Find the survey based on surveyId with improved logging
  useEffect(() => {
    if (surveyId) {
      console.log('Looking for survey with ID:', surveyId);
      console.log('Available surveys:', JSON.stringify(surveys, null, 2));
      
      const foundSurvey = surveys.find(s => s.id === surveyId);
      
      if (foundSurvey) {
        console.log('Survey found:', foundSurvey);
        setSurvey(foundSurvey);
        // Initialize answers array with empty answers for each question
        setAnswers(
          foundSurvey.questions.map(q => ({
            questionId: q.id,
            answer: ''
          }))
        );
      } else {
        console.error('Survey not found with ID:', surveyId);
        // Add more debug information
        console.log('Survey IDs in system:', surveys.map(s => s.id));
      }
      
      setLoading(false);
    }
  }, [surveyId, surveys]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const errors: {[key: string]: string} = {};
    
    if (!respondentInfo.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!respondentInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(respondentInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Clear any errors and move to questions
    setFormErrors({});
    setCurrentStep('questions');
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, answer } 
          : a
      )
    );
  };

  const handleSubmitSurvey = () => {
    // Validate that all questions have answers
    const unansweredQuestions = answers.filter(a => !a.answer.trim());
    
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Missing answers",
        description: `Please answer all questions before submitting.`,
        variant: "destructive"
      });
      return;
    }
    
    // Submit the survey response
    try {
      addSurveyResponse(survey.id, answers, respondentInfo);
      
      // Show success and move to thank you screen
      setCurrentStep('thank-you');
    } catch (error) {
      console.error("Error submitting survey response:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your response. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading survey...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Survey Not Found</h1>
        <p className="text-muted-foreground mb-6">The survey you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        {currentStep === 'intro' && (
          <SurveyIntro 
            survey={survey} 
            onContinue={() => setCurrentStep('info')} 
          />
        )}

        {currentStep === 'info' && (
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>About You</CardTitle>
              <CardDescription>
                Please provide your details to continue with the survey. Your information helps us ensure your store credit is correctly assigned.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleInfoSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    value={respondentInfo.name}
                    onChange={(e) => setRespondentInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && (
                    <p className="text-sm text-destructive">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={respondentInfo.email}
                    onChange={(e) => setRespondentInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                  {formErrors.email && (
                    <p className="text-sm text-destructive">{formErrors.email}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Continue to Survey</Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {currentStep === 'questions' && (
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>{survey.title}</CardTitle>
              {survey.description && (
                <CardDescription>{survey.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              {survey.questions.map((question: any, index: number) => (
                <div key={question.id} className="space-y-4">
                  <Question 
                    question={`${index + 1}. ${question.text}`}
                    description={question.description}
                  />
                  <Textarea 
                    placeholder="Type your answer here..."
                    value={answers.find(a => a.questionId === question.id)?.answer || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="min-h-24"
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitSurvey} className="w-full">Submit Feedback</Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 'thank-you' && (
          <Card className="glass-effect text-center">
            <CardHeader>
              <CardTitle>Thank You!</CardTitle>
              <CardDescription>
                Your feedback has been successfully submitted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-6">
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg mb-4">Your store credit has been earned!</p>
                <p className="text-muted-foreground">
                  Thank you for sharing your thoughts. Your feedback helps our partners improve their products and services.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SurveyResponse;
