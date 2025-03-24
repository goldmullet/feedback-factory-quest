
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
  const [retriesCount, setRetriesCount] = useState(0);

  // Find the survey based on surveyId with improved debugging
  useEffect(() => {
    const findSurvey = async () => {
      if (!surveyId) {
        console.error('No surveyId provided in URL');
        setLoading(false);
        return;
      }
  
      console.log(`[Try ${retriesCount + 1}] Looking for survey with ID:`, surveyId);
      console.log('Available surveys in context:', surveys.length);
      
      // First, try to find the survey in the context
      let foundSurvey = surveys.find(s => s.id === surveyId);
      
      if (foundSurvey) {
        console.log('Survey found in context:', foundSurvey);
        setSurvey(foundSurvey);
        initializeAnswers(foundSurvey);
        setLoading(false);
        return;
      }
      
      // If not found in context, try to find in localStorage directly
      console.log('Survey not found in context, checking localStorage...');
      try {
        const storedSurveysRaw = localStorage.getItem('lovable-surveys');
        if (storedSurveysRaw) {
          const storedSurveys = JSON.parse(storedSurveysRaw);
          console.log('Raw stored surveys from localStorage:', storedSurveysRaw);
          console.log('Parsed surveys from localStorage:', storedSurveys.length);
          
          const localStorageSurvey = storedSurveys.find((s: any) => s.id === surveyId);
          
          if (localStorageSurvey) {
            console.log('Survey found in localStorage:', localStorageSurvey);
            console.log('Survey createdAt:', localStorageSurvey.createdAt);
            
            // Convert createdAt to Date object if needed
            if (localStorageSurvey.createdAt && typeof localStorageSurvey.createdAt !== 'object') {
              localStorageSurvey.createdAt = new Date(localStorageSurvey.createdAt);
            } else if (localStorageSurvey.createdAt?._type === 'Date') {
              localStorageSurvey.createdAt = new Date(localStorageSurvey.createdAt.value.iso);
            }
            
            setSurvey(localStorageSurvey as Survey);
            initializeAnswers(localStorageSurvey as Survey);
            setLoading(false);
            return;
          } else {
            console.error('Survey not found in localStorage with ID:', surveyId);
            console.log('Available survey IDs in localStorage:', storedSurveys.map((s: any) => s.id).join(', '));
          }
        } else {
          console.error('No surveys found in localStorage');
        }
      } catch (error) {
        console.error('Error parsing stored surveys:', error);
      }
      
      setLoading(false);
    };

    findSurvey();
  }, [surveyId, surveys, retriesCount]);

  const initializeAnswers = (surveyData: Survey) => {
    setAnswers(
      surveyData.questions.map(q => ({
        questionId: q.id,
        answer: ''
      }))
    );
  };

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

  const handleRetry = () => {
    setLoading(true);
    setRetriesCount(prev => prev + 1);
    // Give time for context to update
    setTimeout(() => {
      console.log("Retrying to find survey...");
      // This will trigger the useEffect again
      setLoading(false);
    }, 1000);
  };

  const handleNavigateHome = () => {
    // Navigate to the brand dashboard instead of home
    navigate('/brand/dashboard');
  };

  if (loading) {
    return <SurveyLoading />;
  }

  if (!survey) {
    return <SurveyNotFound 
      onNavigateHome={handleNavigateHome} 
      surveyId={surveyId}
      onRetry={handleRetry}
    />;
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
          <SurveyThankYou onNavigateHome={handleNavigateHome} />
        )}
      </div>
    </div>
  );
};

export default SurveyResponse;
