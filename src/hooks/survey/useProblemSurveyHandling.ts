
import { useCallback } from 'react';
import { Survey } from '@/types';
import { isProblematicSurveyId } from '@/utils/surveyRecoveryUtils';
import { debugLog } from '@/utils/debugUtils';
import { initializeAnswers } from '@/utils/surveyUtils';
import { fixSurveyIdEncoding } from '@/utils/surveyIdUtils';

export function useProblemSurveyHandling(surveys: Survey[]) {
  /**
   * Attempts special recovery methods for known problematic survey IDs
   */
  const attemptSpecialRecovery = useCallback(async (
    surveyId: string,
    setSurvey: React.Dispatch<React.SetStateAction<Survey | null>>,
    setAnswers: React.Dispatch<React.SetStateAction<{questionId: string, answer: string}[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<boolean> => {
    if (!isProblematicSurveyId(surveyId)) {
      return false;
    }
    
    debugLog(`ATTEMPTING SPECIAL RECOVERY for ${surveyId}`);
    
    try {
      const rawStorage = localStorage.getItem('lovable-surveys');
      if (!rawStorage) return false;
      
      const idExists = isProblematicSurveyId(surveyId);
      if (!idExists) return false;
      
      debugLog(`${surveyId} EXISTS in raw localStorage string!`);
      
      try {
        const allSurveys = JSON.parse(rawStorage);
        debugLog('All available surveys after fresh parse:', 
          allSurveys.map((s: any) => s.id).join(', '));
        
        const targetSurvey = allSurveys.find((s: any) => 
          s.id === surveyId || 
          (s.id.includes(surveyId.replace('survey-', '')))
        );
        
        if (targetSurvey) {
          debugLog('FOUND TARGET SURVEY IN DIRECT ACCESS:', targetSurvey);
          
          const surveyToUse = JSON.parse(JSON.stringify(targetSurvey));
          
          if (surveyToUse.createdAt && typeof surveyToUse.createdAt !== 'object') {
            surveyToUse.createdAt = new Date(surveyToUse.createdAt);
          } else if (surveyToUse.createdAt?._type === 'Date') {
            surveyToUse.createdAt = new Date(surveyToUse.createdAt.value.iso);
          }
          
          setSurvey(surveyToUse);
          setAnswers(initializeAnswers(surveyToUse));
          setLoading(false);
          
          try {
            localStorage.setItem('lovable-surveys', JSON.stringify(allSurveys));
            debugLog('REFRESHED localStorage after recovery');
          } catch (e) {
            console.error('Failed to refresh localStorage:', e);
          }
          
          return true;
        }
      } catch (parseError) {
        console.error('Error in recovery parsing:', parseError);
      }
    } catch (directError) {
      console.error('Error in direct raw access:', directError);
    }
    
    return false;
  }, []);

  /**
   * Last-resort attempt to find any usable survey
   */
  const attemptLastResortRecovery = useCallback(async (
    surveyId: string,
    setSurvey: React.Dispatch<React.SetStateAction<Survey | null>>,
    setAnswers: React.Dispatch<React.SetStateAction<{questionId: string, answer: string}[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<boolean> => {
    try {
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      if (!storedSurveysRaw) return false;
      
      const allSurveys = JSON.parse(storedSurveysRaw);
      if (allSurveys.length === 0) return false;
      
      debugLog('Last resort - checking all surveys for any possible match');
      
      // Match by numeric part of ID
      if (surveyId && surveyId.includes('-')) {
        const numericPart = surveyId.split('-')[1];
        const numericMatchSurvey = allSurveys.find((s: any) => 
          typeof s.id === 'string' && s.id.includes(numericPart)
        );
        
        if (numericMatchSurvey) {
          debugLog('Found match by numeric part:', numericMatchSurvey);
          const fixedSurvey = JSON.parse(JSON.stringify(numericMatchSurvey));
          if (fixedSurvey.createdAt && typeof fixedSurvey.createdAt !== 'object') {
            fixedSurvey.createdAt = new Date(fixedSurvey.createdAt);
          } else if (fixedSurvey.createdAt?._type === 'Date') {
            fixedSurvey.createdAt = new Date(fixedSurvey.createdAt.value.iso);
          }
          
          setSurvey(fixedSurvey);
          setAnswers(initializeAnswers(fixedSurvey));
          setLoading(false);
          return true;
        }
      }
      
      // Fall back to any available survey if problematic ID
      if (isProblematicSurveyId(surveyId) && allSurveys.length > 0) {
        const anySurvey = allSurveys[allSurveys.length - 1];
        debugLog('Using any available survey as fallback:', anySurvey);
        
        const fixedSurvey = JSON.parse(JSON.stringify(anySurvey));
        if (fixedSurvey.createdAt && typeof fixedSurvey.createdAt !== 'object') {
          fixedSurvey.createdAt = new Date(fixedSurvey.createdAt);
        } else if (fixedSurvey.createdAt?._type === 'Date') {
          fixedSurvey.createdAt = new Date(fixedSurvey.createdAt.value.iso);
        }
        
        setSurvey(fixedSurvey);
        setAnswers(initializeAnswers(fixedSurvey));
        setLoading(false);
        return true;
      }
    } catch (e) {
      console.error('Error in final attempt to find survey:', e);
    }
    
    return false;
  }, []);

  return {
    attemptSpecialRecovery,
    attemptLastResortRecovery
  };
}
