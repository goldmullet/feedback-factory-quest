
import { useEffect } from 'react';
import { Survey } from '@/types';
import { debugLog } from '@/utils/debugUtils';
import { checkLocalStorageSurveys, isProblematicSurveyId } from '@/utils/surveyRecoveryUtils';

/**
 * Hook to handle debugging and recovery for problematic surveys
 */
export function useSurveyDebugger(
  surveyId: string | undefined,
  survey: Survey | null,
  loading: boolean,
  surveys: Survey[],
  manualRecoveryAttempted: boolean,
  setManualRecoveryAttempted: (value: boolean) => void,
  forceSurveyRecovery: (surveyId: string, silent: boolean) => void,
  handleRetry: () => void
) {
  // Debug output on mount and when survey status changes
  useEffect(() => {
    debugLog(`SurveyResponse rendered - Survey ID from URL: ${surveyId}`);
    debugLog(`Survey loaded: ${!!survey}, Loading: ${loading}`);
    debugLog('Available surveys from context:', surveys.map(s => s.id).join(', '));
    
    // Manually check if the survey is in localStorage
    checkLocalStorageSurveys(surveyId);
    
    // Special silent handling for specific problematic survey
    if (surveyId === 'survey-1742853415451' && !survey && !manualRecoveryAttempted) {
      debugLog('ATTEMPTING SILENT RECOVERY FOR survey-1742853415451');
      
      setManualRecoveryAttempted(true);
      
      // Try to force recovery for this specific survey - silently
      forceSurveyRecovery('survey-1742853415451', true);
      
      // Force retry after a short delay
      setTimeout(handleRetry, 300);
    }
    
    // Check if survey exists in localStorage but not loaded in component
    try {
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      if (storedSurveysRaw) {
        const exactMatch = JSON.parse(storedSurveysRaw).some((s: any) => s.id === surveyId);
        if (exactMatch && !survey && !loading) {
          debugLog('CRITICAL: Survey found in localStorage but not loaded in component state');
          // Force a retry after a short delay if we detect this condition
          setTimeout(handleRetry, 500);
        }
      }
    } catch (error) {
      debugLog('Error checking localStorage match:', error);
    }
  }, [surveyId, survey, loading, handleRetry, surveys, manualRecoveryAttempted, forceSurveyRecovery, setManualRecoveryAttempted]);

  // Additional retry logic for problematic surveys
  useEffect(() => {
    // If after 3 seconds we still don't have a survey and we're not loading, try a final recovery
    if (surveyId === 'survey-1742853415451' && !survey && !loading && !manualRecoveryAttempted) {
      const timeoutId = setTimeout(() => {
        debugLog('LAST RESORT SILENT RECOVERY ATTEMPT FOR survey-1742853415451');
        setManualRecoveryAttempted(true);
        forceSurveyRecovery('survey-1742853415451', true);
        setTimeout(handleRetry, 500);
      }, 3000); // 3 second delay
      
      return () => clearTimeout(timeoutId);
    }
  }, [surveyId, survey, loading, manualRecoveryAttempted, forceSurveyRecovery, handleRetry, setManualRecoveryAttempted]);
}
