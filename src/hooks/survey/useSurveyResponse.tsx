
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFeedback } from '@/context/feedback';
import { useToast } from '@/hooks/use-toast';
import { useRespondentForm, RespondentInfo } from '@/hooks/useRespondentForm';
import { useSurveyLoading } from './useSurveyLoading';
import { useSurveyAnswers } from './useSurveyAnswers';
import { useSurveyNavigation, SurveyStep } from './useSurveyNavigation';
import { useSurveyRecovery } from './useSurveyRecovery';

export function useSurveyResponse() {
  const { surveyId } = useParams();
  const { surveys, addSurveyResponse } = useFeedback();
  const { toast } = useToast();
  const [manualRecoveryAttempted, setManualRecoveryAttempted] = useState(false);
  
  // Load the survey
  const {
    survey,
    loading,
    answers,
    setAnswers,
    directLocalStorageCheck,
    handleRetry,
    forceSurveyRecovery
  } = useSurveyLoading(surveyId, surveys);

  // Handle survey answers
  const {
    handleAnswerChange,
    validateAudioResponses
  } = useSurveyAnswers();

  // Handle navigation
  const {
    currentStep,
    setCurrentStep,
    handleNavigateHome
  } = useSurveyNavigation();

  // Respondent form
  const { 
    respondentInfo, 
    setRespondentInfo,
    formErrors, 
    handleInfoSubmit 
  } = useRespondentForm(() => setCurrentStep('questions'));

  // Handle survey submission
  const handleSubmitSurvey = (
    respondentInfo: RespondentInfo, 
    audioBlobs: {[key: string]: Blob} = {},
    processedAnswers?: {questionId: string, answer: string, transcription?: string, insights?: string[]}[]
  ) => {
    if (!validateAudioResponses(survey, audioBlobs)) {
      return;
    }
    
    try {
      if (survey) {
        console.log('Adding survey response with audio blobs:', Object.keys(audioBlobs).length);
        console.log('Using AI processed answers:', !!processedAnswers);
        
        // Use processed answers if available, otherwise use regular answers
        const answersToSubmit = processedAnswers || answers;
        
        addSurveyResponse(survey.id, answersToSubmit, respondentInfo, audioBlobs);
        
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
    handleNavigateHome,
    forceSurveyRecovery,
    manualRecoveryAttempted,
    setManualRecoveryAttempted
  };
}
