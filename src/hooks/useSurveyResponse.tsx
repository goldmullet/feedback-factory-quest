
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
      
      // Try URL decoding for safety
      const decodedSurveyId = decodeURIComponent(surveyId);
      if (decodedSurveyId !== surveyId) {
        console.log(`Survey ID was URL encoded. Decoded: ${decodedSurveyId}`);
      }
      
      // First try to find in context surveys
      let foundSurvey = findSurveyById(surveyId, surveys, setDirectLocalStorageCheck);
      
      // If not found with original ID, try with decoded ID
      if (!foundSurvey && decodedSurveyId !== surveyId) {
        console.log(`Trying with decoded ID: ${decodedSurveyId}`);
        foundSurvey = findSurveyById(decodedSurveyId, surveys, setDirectLocalStorageCheck);
      }
      
      if (foundSurvey) {
        console.log('Found survey in context:', foundSurvey);
        setSurvey(foundSurvey);
        setAnswers(initializeAnswers(foundSurvey));
        setLoading(false);
        return;
      }
      
      // If not found in context, try localStorage directly
      const localStorageSurvey = findSurveyInLocalStorage(surveyId, setDirectLocalStorageCheck);
      
      // If direct lookup fails, try with the decoded ID
      if (!localStorageSurvey && decodedSurveyId !== surveyId) {
        console.log(`Direct localStorage lookup failed, trying with decoded ID: ${decodedSurveyId}`);
        const decodedLocalStorageSurvey = findSurveyInLocalStorage(decodedSurveyId, setDirectLocalStorageCheck);
        if (decodedLocalStorageSurvey) {
          console.log('Found survey in localStorage with decoded ID:', decodedLocalStorageSurvey);
          setSurvey(decodedLocalStorageSurvey);
          setAnswers(initializeAnswers(decodedLocalStorageSurvey));
          setLoading(false);
          return;
        }
      }
      
      // Last resort: direct raw lookup in localStorage
      try {
        console.log('Attempting raw localStorage lookup as last resort...');
        const rawStorage = localStorage.getItem('lovable-surveys');
        if (rawStorage) {
          const allSurveys = JSON.parse(rawStorage);
          console.log(`Found ${allSurveys.length} surveys in raw localStorage`);
          
          // Try exact match
          const exactSurvey = allSurveys.find((s: any) => s.id === surveyId);
          if (exactSurvey) {
            console.log('Found exact match in raw lookup:', exactSurvey);
            // Process dates properly
            if (exactSurvey.createdAt?._type === 'Date') {
              exactSurvey.createdAt = new Date(exactSurvey.createdAt.value.iso);
            } else if (typeof exactSurvey.createdAt === 'string') {
              exactSurvey.createdAt = new Date(exactSurvey.createdAt);
            }
            
            setSurvey(exactSurvey);
            setAnswers(initializeAnswers(exactSurvey));
            setLoading(false);
            return;
          }
          
          // Try with the specific ID we're looking for
          if (surveyId === 'survey-1742850890608') {
            console.log('Looking for the specific problematic survey...');
            const targetSurvey = allSurveys.find((s: any) => 
              s.id === 'survey-1742850890608' || 
              s.id.includes('1742850890608')
            );
            
            if (targetSurvey) {
              console.log('Found the target problematic survey:', targetSurvey);
              // Process dates properly
              if (targetSurvey.createdAt?._type === 'Date') {
                targetSurvey.createdAt = new Date(targetSurvey.createdAt.value.iso);
              } else if (typeof targetSurvey.createdAt === 'string') {
                targetSurvey.createdAt = new Date(targetSurvey.createdAt);
              }
              
              setSurvey(targetSurvey);
              setAnswers(initializeAnswers(targetSurvey));
              setLoading(false);
              return;
            }
          }
          
          // Try case-insensitive
          const caseInsensitiveSurvey = allSurveys.find((s: any) => 
            typeof s.id === 'string' && s.id.toLowerCase() === surveyId.toLowerCase()
          );
          
          if (caseInsensitiveSurvey) {
            console.log('Found case-insensitive match in raw lookup:', caseInsensitiveSurvey);
            // Process dates properly
            if (caseInsensitiveSurvey.createdAt?._type === 'Date') {
              caseInsensitiveSurvey.createdAt = new Date(caseInsensitiveSurvey.createdAt.value.iso);
            } else if (typeof caseInsensitiveSurvey.createdAt === 'string') {
              caseInsensitiveSurvey.createdAt = new Date(caseInsensitiveSurvey.createdAt);
            }
            
            setSurvey(caseInsensitiveSurvey);
            setAnswers(initializeAnswers(caseInsensitiveSurvey));
            setLoading(false);
            return;
          }
          
          // Try partial match as last resort
          const partialMatchSurvey = allSurveys.find((s: any) => 
            typeof s.id === 'string' && (s.id.includes(surveyId) || surveyId.includes(s.id))
          );
          
          if (partialMatchSurvey) {
            console.log('Found partial match in raw lookup:', partialMatchSurvey);
            // Process dates properly
            if (partialMatchSurvey.createdAt?._type === 'Date') {
              partialMatchSurvey.createdAt = new Date(partialMatchSurvey.createdAt.value.iso);
            } else if (typeof partialMatchSurvey.createdAt === 'string') {
              partialMatchSurvey.createdAt = new Date(partialMatchSurvey.createdAt);
            }
            
            setSurvey(partialMatchSurvey);
            setAnswers(initializeAnswers(partialMatchSurvey));
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error in raw localStorage lookup:', error);
      }
      
      if (localStorageSurvey) {
        console.log('Found survey in localStorage:', localStorageSurvey);
        setSurvey(localStorageSurvey);
        setAnswers(initializeAnswers(localStorageSurvey));
      } else {
        console.error('Survey not found in context or localStorage');
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
