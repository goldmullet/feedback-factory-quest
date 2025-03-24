
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RespondentInfo } from '@/hooks/useRespondentForm';

export type SurveyStep = 'intro' | 'info' | 'questions' | 'thank-you';

export function useSurveyNavigation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SurveyStep>('intro');
  
  const handleNavigateHome = useCallback(() => {
    navigate('/brand/dashboard');
  }, [navigate]);
  
  return {
    currentStep,
    setCurrentStep,
    handleNavigateHome
  };
}
