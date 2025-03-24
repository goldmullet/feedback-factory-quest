
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeedback } from '@/context/feedback';
import { useToast } from '@/hooks/use-toast';
import { Survey } from '@/types';
import { findSurveyById, findSurveyInLocalStorage, initializeAnswers, validateSurveyResponse } from '@/utils/surveyUtils';
import { useRespondentForm, RespondentInfo } from '@/hooks/useRespondentForm';

type SurveyStep = 'intro' | 'info' | 'questions' | 'thank-you';

export function useSurveyResponse() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { surveys, addSurveyResponse } = useFeedback();
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<SurveyStep>('intro');
  const [answers, setAnswers] = useState<{questionId: string, answer: string}[]>([]);
  const [retriesCount, setRetriesCount] = useState(0);
  const [directLocalStorageCheck, setDirectLocalStorageCheck] = useState(false);
  
  // Initialize the form handling
  const { 
    respondentInfo, 
    setRespondentInfo,
    formErrors, 
    handleInfoSubmit 
  } = useRespondentForm(() => setCurrentStep('questions'));

  // Find the survey based on surveyId
  useEffect(() => {
    const loadSurvey = async () => {
      setLoading(true);
      
      if (!surveyId) {
        console.error('No surveyId provided in URL');
        setLoading(false);
        return;
      }
      
      console.log(`[Try ${retriesCount + 1}] Looking for survey with ID:`, surveyId);
      
      // First try to find in context
      const foundSurvey = findSurveyById(surveyId, surveys, setDirectLocalStorageCheck);
      
      if (foundSurvey) {
        setSurvey(foundSurvey);
        setAnswers(initializeAnswers(foundSurvey));
        setLoading(false);
        return;
      }
      
      // If not found in context, try localStorage
      const localStorageSurvey = findSurveyInLocalStorage(surveyId, setDirectLocalStorageCheck);
      
      if (localStorageSurvey) {
        setSurvey(localStorageSurvey);
        setAnswers(initializeAnswers(localStorageSurvey));
      }
      
      setLoading(false);
    };

    loadSurvey();
  }, [surveyId, surveys, retriesCount]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, answer } 
          : a
      )
    );
  };

  const handleSubmitSurvey = (respondentInfo: RespondentInfo) => {
    // Validate responses
    if (!validateSurveyResponse(answers, toast)) {
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
    toast({
      title: "Retrying",
      description: "Attempting to load the survey again...",
    });
  }, [toast]);

  const handleNavigateHome = useCallback(() => {
    navigate('/brand/dashboard');
  }, [navigate]);

  return {
    survey,
    loading,
    currentStep,
    answers,
    formErrors,
    respondentInfo,
    setRespondentInfo,
    directLocalStorageCheck,
    setCurrentStep,
    handleInfoSubmit,
    handleAnswerChange,
    handleSubmitSurvey,
    handleRetry,
    handleNavigateHome
  };
}
