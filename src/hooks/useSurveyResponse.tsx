
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeedback } from '@/context/feedback';
import { useToast } from '@/hooks/use-toast';
import { Survey } from '@/types';

export function useSurveyResponse() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { surveys, addSurveyResponse } = useFeedback();
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'info', 'questions', 'thank-you'
  const [answers, setAnswers] = useState<{questionId: string, answer: string}[]>([]);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [retriesCount, setRetriesCount] = useState(0);
  const [directLocalStorageCheck, setDirectLocalStorageCheck] = useState(false);

  // Find the survey based on surveyId with improved debugging
  useEffect(() => {
    const findSurvey = async () => {
      console.log(`[Looking for survey] ${surveyId}`);
      setLoading(true);
      
      if (!surveyId) {
        console.error('No surveyId provided in URL');
        setLoading(false);
        return;
      }
  
      console.log(`[Try ${retriesCount + 1}] Looking for survey with ID:`, surveyId);
      console.log('Available surveys in context:', surveys.length);
      
      // First, try to find the survey in the context
      let foundSurvey = surveys.find(s => s.id === surveyId);
      
      // If not found with exact match, try case-insensitive match in context
      if (!foundSurvey) {
        console.log('Trying case-insensitive match in context...');
        foundSurvey = surveys.find(s => 
          typeof s.id === 'string' && s.id.toLowerCase() === surveyId.toLowerCase()
        );
      }
      
      if (foundSurvey) {
        console.log('Survey found in context:', foundSurvey);
        setSurvey(foundSurvey);
        initializeAnswers(foundSurvey);
        setLoading(false);
        return;
      }
      
      // If not found in context, try to find in localStorage directly
      console.log('Survey not found in context, checking localStorage directly...');
      try {
        const storedSurveysRaw = localStorage.getItem('lovable-surveys');
        if (storedSurveysRaw) {
          console.log('Raw stored surveys from localStorage:', storedSurveysRaw);
          setDirectLocalStorageCheck(true);
          
          // Parse the stored surveys
          let storedSurveys;
          try {
            storedSurveys = JSON.parse(storedSurveysRaw);
            console.log('Number of surveys in localStorage:', storedSurveys.length);
            console.log('Available survey IDs:', storedSurveys.map((s: any) => s.id).join(', '));
            
            // Check if our survey ID is in the localStorage data
            const exactMatch = storedSurveys.some((s: any) => s.id === surveyId);
            const caseInsensitiveMatch = storedSurveys.some((s: any) => 
              typeof s.id === 'string' && s.id.toLowerCase() === surveyId.toLowerCase()
            );
            
            console.log(`Survey ID exact match in localStorage: ${exactMatch}`);
            console.log(`Survey ID case-insensitive match in localStorage: ${caseInsensitiveMatch}`);
            
          } catch (parseError) {
            console.error('Error parsing localStorage surveys:', parseError);
            toast({
              title: "Data Error",
              description: "There was an error loading survey data. Please try again.",
              variant: "destructive"
            });
            setLoading(false);
            return;
          }
          
          // Try exact match
          let localStorageSurvey = storedSurveys.find((s: any) => s.id === surveyId);
          
          // If not found, try case-insensitive match
          if (!localStorageSurvey) {
            console.log('Trying case-insensitive match in localStorage...');
            localStorageSurvey = storedSurveys.find((s: any) => 
              typeof s.id === 'string' && s.id.toLowerCase() === surveyId.toLowerCase()
            );
          }
          
          if (localStorageSurvey) {
            console.log('Survey found in localStorage:', localStorageSurvey);
            
            // Deep clone to avoid reference issues
            const surveyToUse = JSON.parse(JSON.stringify(localStorageSurvey));
            
            // Convert createdAt to Date object if needed
            if (surveyToUse.createdAt && typeof surveyToUse.createdAt !== 'object') {
              surveyToUse.createdAt = new Date(surveyToUse.createdAt);
            } else if (surveyToUse.createdAt?._type === 'Date') {
              surveyToUse.createdAt = new Date(surveyToUse.createdAt.value.iso);
            }
            
            console.log('Using survey with processed date:', surveyToUse);
            
            setSurvey(surveyToUse as Survey);
            initializeAnswers(surveyToUse as Survey);
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
        console.error('Error accessing stored surveys:', error);
      }
      
      setLoading(false);
    };

    findSurvey();
  }, [surveyId, surveys, retriesCount, toast]);

  const initializeAnswers = (surveyData: Survey) => {
    if (!surveyData.questions || !Array.isArray(surveyData.questions)) {
      console.error('Invalid survey questions data:', surveyData);
      return;
    }
    
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
    
    setFormErrors({});
    setCurrentStep('questions');
    
    return info; // Return the info so the parent component can use it
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

  const handleSubmitSurvey = (respondentInfo: {name: string, email: string}) => {
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
        
        // Show success and move to thank you screen
        toast({
          title: "Success",
          description: "Your feedback has been submitted successfully.",
        });
        
        setCurrentStep('thank-you');
      } else {
        throw new Error("Survey not found");
      }
    } catch (error) {
      console.error("Error submitting survey response:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your response. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRetry = useCallback(() => {
    setLoading(true);
    setRetriesCount(prev => prev + 1);
  }, []);

  const handleNavigateHome = useCallback(() => {
    navigate('/brand/dashboard');
  }, [navigate]);

  return {
    survey,
    loading,
    currentStep,
    answers,
    formErrors,
    directLocalStorageCheck,
    setCurrentStep,
    handleInfoSubmit,
    handleAnswerChange,
    handleSubmitSurvey,
    handleRetry,
    handleNavigateHome
  };
}
