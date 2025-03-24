
import { useSurveyResponse } from '@/hooks/useSurveyResponse';
import SurveyIntro from '@/components/survey/SurveyIntro';
import SurveyRespondentForm from '@/components/survey/SurveyRespondentForm';
import SurveyQuestions from '@/components/survey/SurveyQuestions';
import SurveyThankYou from '@/components/survey/SurveyThankYou';
import SurveyNotFound from '@/components/survey/SurveyNotFound';
import SurveyLoading from '@/components/survey/SurveyLoading';
import SurveyResponseLayout from '@/components/survey/SurveyResponseLayout';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFeedback } from '@/context/feedback';

const SurveyResponse = () => {
  const { surveyId } = useParams();
  const { toast } = useToast();
  const { surveys } = useFeedback();
  
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
    handleNavigateHome
  } = useSurveyResponse();
  
  // Debug output on mount and when survey status changes
  useEffect(() => {
    console.log(`SurveyResponse rendered - Survey ID from URL: ${surveyId}`);
    console.log(`Survey loaded: ${!!survey}, Loading: ${loading}`);
    console.log('Available surveys from context:', surveys.map(s => s.id).join(', '));
    
    // Manually check if the survey is in localStorage
    try {
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      if (storedSurveysRaw) {
        const storedSurveys = JSON.parse(storedSurveysRaw);
        console.log('All available surveys in localStorage:', storedSurveys.map((s: any) => s.id).join(', '));
        
        const exactMatch = storedSurveys.some((s: any) => s.id === surveyId);
        console.log(`Manual check - Survey ID exact match in localStorage: ${exactMatch}`);
        
        // For all problematic survey IDs
        const problematicSurveyIds = ['survey-1742852600629', 'survey-1742852947140', 'survey-1742850890608'];
        
        if (surveyId && problematicSurveyIds.some(id => surveyId === id || surveyId?.includes(id.replace('survey-', '')))) {
          const idToCheck = surveyId;
          console.log(`ATTEMPTING SPECIAL RECOVERY for ${idToCheck}`);
          
          // Look for this specific ID
          const targetSurvey = storedSurveys.find((s: any) => 
            s.id === idToCheck || 
            s.id.includes(idToCheck.replace('survey-', ''))
          );
          
          if (targetSurvey) {
            console.log('FOUND TARGET SURVEY:', targetSurvey);
            
            // Force the update of localStorage to ensure it's properly formatted
            try {
              let updatedSurveys = [...storedSurveys];
              localStorage.setItem('lovable-surveys', JSON.stringify(updatedSurveys));
              console.log('REFRESHED localStorage');
            } catch (e) {
              console.error('Failed to refresh localStorage:', e);
            }
          }
        }
        
        if (exactMatch && !survey && !loading) {
          console.log('CRITICAL: Survey found in localStorage but not loaded in component state');
          // Force a retry after a short delay if we detect this condition
          setTimeout(handleRetry, 500);
        }
      } else {
        console.error('NO SURVEYS found in localStorage');
      }
    } catch (error) {
      console.error('Error in manual localStorage check:', error);
    }
    
    if (survey) {
      console.log('Successfully loaded survey:', survey.title);
      // Notify with toast for successful load
      toast({
        title: "Survey Loaded",
        description: `Successfully loaded "${survey.title}" with ${survey.questions.length} questions`,
      });
    }
  }, [surveyId, survey, loading, toast, handleRetry, surveys]);

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
