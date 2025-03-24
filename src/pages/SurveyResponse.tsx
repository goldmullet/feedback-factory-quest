
import { useSurveyResponse } from '@/hooks/useSurveyResponse';
import SurveyIntro from '@/components/survey/SurveyIntro';
import SurveyRespondentForm from '@/components/survey/SurveyRespondentForm';
import SurveyQuestions from '@/components/survey/SurveyQuestions';
import SurveyThankYou from '@/components/survey/SurveyThankYou';
import SurveyNotFound from '@/components/survey/SurveyNotFound';
import SurveyLoading from '@/components/survey/SurveyLoading';
import SurveyResponseLayout from '@/components/survey/SurveyResponseLayout';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const SurveyResponse = () => {
  const { surveyId } = useParams();
  const { toast } = useToast();
  const {
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
  } = useSurveyResponse();
  
  // Local state for respondent info 
  const [respondentInfo, setRespondentInfo] = useState({
    name: '',
    email: ''
  });
  
  // Debug output on mount and when survey status changes
  useEffect(() => {
    console.log(`SurveyResponse rendered - Survey ID from URL: ${surveyId}`);
    console.log(`Survey loaded: ${!!survey}, Loading: ${loading}`);
    
    if (survey) {
      console.log('Successfully loaded survey:', survey.title);
      // Notify with toast for successful load
      toast({
        title: "Survey Loaded",
        description: `Successfully loaded "${survey.title}" with ${survey.questions.length} questions`,
      });
    }
  }, [surveyId, survey, loading, toast]);

  if (loading) {
    return <SurveyLoading />;
  }

  if (!survey) {
    return <SurveyNotFound 
      onNavigateHome={handleNavigateHome} 
      surveyId={surveyId}
      onRetry={handleRetry}
      directLocalStorageCheck={directLocalStorageCheck}
    />;
  }

  const onInfoSubmit = (info: {name: string, email: string}, errors: {[key: string]: string}) => {
    const validInfo = handleInfoSubmit(info, errors);
    if (validInfo) {
      setRespondentInfo(validInfo);
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
          onSubmit={onInfoSubmit}
        />
      )}

      {currentStep === 'questions' && (
        <SurveyQuestions
          survey={survey}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onSubmit={() => handleSubmitSurvey(respondentInfo)}
        />
      )}

      {currentStep === 'thank-you' && (
        <SurveyThankYou onNavigateHome={handleNavigateHome} />
      )}
    </SurveyResponseLayout>
  );
};

export default SurveyResponse;
