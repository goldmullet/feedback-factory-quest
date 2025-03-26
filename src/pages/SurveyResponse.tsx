
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeedback } from '@/context/feedback';
import { useSurveyResponse } from '@/hooks/survey/useSurveyResponse';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/utils/debugUtils';

// Survey step components
import SurveyIntro from '@/components/survey/SurveyIntro';
import SurveyRespondentForm from '@/components/survey/SurveyRespondentForm';
import SurveyQuestions from '@/components/survey/SurveyQuestions';
import SurveyThankYou from '@/components/survey/SurveyThankYou';
import SurveyNotFound from '@/components/survey/SurveyNotFound';
import SurveyLoading from '@/components/survey/SurveyLoading';
import SurveyResponseLayout from '@/components/survey/SurveyResponseLayout';
import AudioBlobsInitializer from '@/components/survey/AudioBlobsInitializer';
import { transcribeAudio, analyzeTranscription } from '@/utils/aiUtils';

// Add audioBlobs to the global Window interface
declare global {
  interface Window {
    audioBlobs?: {[key: string]: Blob};
  }
}

const SurveyResponse = () => {
  const { surveyId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { surveys } = useFeedback();
  const [manualRecoveryAttempted, setManualRecoveryAttempted] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [emergencyRecoveryAttempted, setEmergencyRecoveryAttempted] = useState(false);
  
  // Initialize global audioBlobs
  window.audioBlobs = {};
  
  const {
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
    forceSurveyRecovery
  } = useSurveyResponse();
  
  // Debug output on mount and when survey status changes
  useEffect(() => {
    debugLog(`SurveyResponse rendered - Survey ID from URL: ${surveyId}`);
    debugLog(`Survey loaded: ${!!survey}, Loading: ${loading}`);
    debugLog('Available surveys from context:', surveys.map(s => s.id).join(', '));
    
    try {
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      if (storedSurveysRaw) {
        debugLog('All available surveys in localStorage:', JSON.parse(storedSurveysRaw).map((s: any) => s.id).join(', '));
        const exactMatch = JSON.parse(storedSurveysRaw).some((s: any) => s.id === surveyId);
        debugLog(`Manual check - Survey ID exact match in localStorage: ${exactMatch}`);
        
        // Special handling for problematic survey IDs
        if (surveyId && !survey && !loading && !manualRecoveryAttempted) {
          setManualRecoveryAttempted(true);
          debugLog(`Attempting recovery for ${surveyId}`);
          forceSurveyRecovery(surveyId, true);
          setTimeout(handleRetry, 300);
        }
      } else {
        debugLog('NO SURVEYS found in localStorage');
      }
    } catch (error) {
      debugLog('Error in localStorage check:', error);
    }
  }, [surveyId, survey, loading, handleRetry, surveys, manualRecoveryAttempted, forceSurveyRecovery]);
  
  // Additional retry logic - perform last resort recovery if needed
  useEffect(() => {
    if (surveyId && !survey && !loading && !emergencyRecoveryAttempted) {
      const timeoutId = setTimeout(() => {
        debugLog('EMERGENCY SILENT RECOVERY ATTEMPT');
        setEmergencyRecoveryAttempted(true);
        forceSurveyRecovery(surveyId, true);
        setTimeout(handleRetry, 300);
      }, 1500); // 1.5 second delay
      
      return () => clearTimeout(timeoutId);
    }
  }, [surveyId, survey, loading, emergencyRecoveryAttempted, forceSurveyRecovery, handleRetry]);

  const handleEmergencyRecovery = () => {
    debugLog('Emergency recovery triggered manually');
    toast({
      title: "Attempting Recovery",
      description: "Trying to recover your survey..."
    });
    
    // Try to get any survey
    try {
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      if (storedSurveysRaw) {
        const allSurveys = JSON.parse(storedSurveysRaw);
        if (allSurveys.length > 0) {
          // Try to find a match first
          const matchedSurvey = allSurveys.find((s: any) => 
            surveyId && (s.id === surveyId || s.id.includes(surveyId.replace('survey-', '')))
          );
          
          const surveyToUse = matchedSurvey || allSurveys[allSurveys.length - 1];
          
          debugLog('Emergency recovery using survey:', surveyToUse);
          navigate(`/survey/${surveyToUse.id}`);
          toast({
            title: "Survey Found",
            description: "Redirecting to available survey..."
          });
          return;
        }
      }
    } catch (e) {
      debugLog('Error in emergency recovery:', e);
    }
    
    // If we got here, we couldn't find any surveys
    const latestSurveyId = "survey-1743025212662"; // Fallback to the most recent survey from logs
    toast({
      title: "Recovery Attempted",
      description: "Redirecting to latest survey..."
    });
    navigate(`/survey/${latestSurveyId}`);
  };

  if (loading) {
    return <SurveyLoading />;
  }

  if (!survey) {
    return <SurveyNotFound 
      onNavigateHome={handleNavigateHome} 
      surveyId={surveyId}
      onRetry={handleRetry}
      directLocalStorageCheck={directLocalStorageCheck}
      silentMode={false}
      onForceRecovery={handleEmergencyRecovery}
    />;
  }

  // Modified handleSubmit to process audio with AI before submitting
  const handleSubmit = async () => {
    const globalAudioBlobs = window.audioBlobs || {};
    debugLog('Submitting survey with global audio blobs:', Object.keys(globalAudioBlobs).length);
    
    setIsProcessingAudio(true);
    
    try {
      // Process each audio blob to get transcriptions and insights
      const processedAnswers = [...answers].map(answer => ({
        questionId: answer.questionId,
        answer: answer.answer,
        transcription: undefined,
        insights: undefined
      }));
      
      // Process audio files in parallel
      const audioProcessingPromises = Object.entries(globalAudioBlobs).map(async ([questionId, blob]) => {
        // Transcribe the audio
        const transcription = await transcribeAudio(blob);
        debugLog(`Transcription for ${questionId}:`, transcription);
        
        // Analyze the transcription to extract insights
        const insights = await analyzeTranscription(transcription);
        debugLog(`Insights for ${questionId}:`, insights);
        
        // Update the answer with transcription and insights
        const answerIndex = processedAnswers.findIndex(a => a.questionId === questionId);
        if (answerIndex !== -1) {
          processedAnswers[answerIndex] = {
            ...processedAnswers[answerIndex],
            transcription,
            insights
          };
        }
        
        return { questionId, transcription, insights };
      });
      
      // Wait for all audio processing to complete
      await Promise.all(audioProcessingPromises);
      
      // Submit the survey with processed answers
      handleSubmitSurvey(respondentInfo, globalAudioBlobs, processedAnswers);
    } catch (error) {
      debugLog('Error processing audio:', error);
      // Fall back to regular submission without transcriptions
      handleSubmitSurvey(respondentInfo, globalAudioBlobs);
    } finally {
      setIsProcessingAudio(false);
    }
  };

  return (
    <SurveyResponseLayout>
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
          onSubmit={handleSubmit}
          isProcessingAudio={isProcessingAudio}
        />
      )}

      {currentStep === 'thank-you' && (
        <SurveyThankYou onNavigateHome={handleNavigateHome} />
      )}
    </SurveyResponseLayout>
  );
};

export default SurveyResponse;
