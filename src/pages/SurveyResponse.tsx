
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeedback } from '@/context/feedback';
import { useToast } from '@/hooks/use-toast';
import { Survey } from '@/types';
import SurveyIntro from '@/components/survey/SurveyIntro';
import SurveyRespondentForm from '@/components/survey/SurveyRespondentForm';
import SurveyQuestions from '@/components/survey/SurveyQuestions';
import SurveyThankYou from '@/components/survey/SurveyThankYou';
import SurveyNotFound from '@/components/survey/SurveyNotFound';
import SurveyLoading from '@/components/survey/SurveyLoading';

const SurveyResponse = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { surveys, addSurveyResponse } = useFeedback();
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'info', 'questions', 'thank-you'
  const [respondentInfo, setRespondentInfo] = useState({
    name: '',
    email: ''
  });
  const [answers, setAnswers] = useState<{questionId: string, answer: string}[]>([]);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Find the survey based on surveyId with improved debugging
  useEffect(() => {
    if (!surveyId) {
      console.error('No surveyId provided in URL');
      setLoading(false);
      return;
    }

    console.log('Looking for survey with ID:', surveyId);
    console.log('Available surveys:', surveys.length, JSON.stringify(surveys.map(s => ({id: s.id, title: s.title})), null, 2));
    
    // Check if surveys array is empty
    if (surveys.length === 0) {
      console.error('No surveys available in the context');
      setLoading(false);
      return;
    }
    
    // Directly check local storage as a fallback
    const storedSurveys = localStorage.getItem('lovable-surveys');
    console.log('Raw stored surveys from localStorage:', storedSurveys);
    
    let foundSurvey = surveys.find(s => s.id === surveyId);
    
    // If not found in context, try to find in localStorage
    if (!foundSurvey && storedSurveys) {
      try {
        const parsedSurveys = JSON.parse(storedSurveys);
        console.log('Parsed surveys from localStorage:', parsedSurveys);
        
        const localStorageSurvey = parsedSurveys.find((s: any) => s.id === surveyId);
        
        if (localStorageSurvey) {
          console.log('Survey found in localStorage:', localStorageSurvey);
          // Convert createdAt back to Date object if needed
          if (localStorageSurvey.createdAt && typeof localStorageSurvey.createdAt !== 'object') {
            localStorageSurvey.createdAt = new Date(localStorageSurvey.createdAt);
          } else if (localStorageSurvey.createdAt?._type === 'Date') {
            localStorageSurvey.createdAt = new Date(localStorageSurvey.createdAt.value.iso);
          }
          
          foundSurvey = localStorageSurvey;
        }
      } catch (error) {
        console.error('Error parsing stored surveys:', error);
      }
    }
    
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
  }, [surveyId, surveys]);

  const handleInfoSubmit = (info: {name: string, email: string}, errors: {[key: string]: string}) => {
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setRespondentInfo(info);
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
      if (survey) {
        addSurveyResponse(survey.id, answers, respondentInfo);
      }
      
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
    return <SurveyLoading />;
  }

  if (!survey) {
    return <SurveyNotFound onNavigateHome={() => navigate('/')} />;
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
          <SurveyRespondentForm
            respondentInfo={respondentInfo}
            setRespondentInfo={setRespondentInfo}
            formErrors={formErrors}
            onSubmit={handleInfoSubmit}
          />
        )}

        {currentStep === 'questions' && (
          <SurveyQuestions
            survey={survey}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmitSurvey}
          />
        )}

        {currentStep === 'thank-you' && (
          <SurveyThankYou onNavigateHome={() => navigate('/')} />
        )}
      </div>
    </div>
  );
};

export default SurveyResponse;
