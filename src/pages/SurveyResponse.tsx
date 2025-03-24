
import { useSurveyResponse } from '@/hooks/useSurveyResponse';
import SurveyIntro from '@/components/survey/SurveyIntro';
import SurveyRespondentForm from '@/components/survey/SurveyRespondentForm';
import SurveyQuestions from '@/components/survey/SurveyQuestions';
import SurveyThankYou from '@/components/survey/SurveyThankYou';
import SurveyNotFound from '@/components/survey/SurveyNotFound';
import SurveyLoading from '@/components/survey/SurveyLoading';
import SurveyResponseLayout from '@/components/survey/SurveyResponseLayout';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const SurveyResponse = () => {
  const { surveyId } = useParams();
  const {
    survey,
    loading,
    currentStep,
    answers,
    formErrors,
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
