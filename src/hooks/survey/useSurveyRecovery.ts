
import { useCallback } from 'react';
import { Survey } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { debugLog, debugError } from '@/utils/debugUtils';

export function useSurveyRecovery(surveys: Survey[]) {
  const { toast } = useToast();
  
  const forceSurveyRecovery = useCallback((specificSurveyId: string, silent: boolean = false) => {
    debugLog(`Force recovery for survey: ${specificSurveyId}, silent: ${silent}`);
    
    try {
      // First check if the survey exists in the context
      const contextSurvey = surveys.find(s => 
        s.id === specificSurveyId || 
        s.id.includes(specificSurveyId.replace('survey-', ''))
      );
      
      if (contextSurvey) {
        debugLog('FOUND TARGET SURVEY IN CONTEXT:', contextSurvey);
        if (!silent) {
          toast({
            title: "Survey Loaded",
            description: `Successfully loaded "${contextSurvey.title}"`,
          });
        }
        return { surveyToUse: contextSurvey, success: true };
      }
      
      // If not in context, try localStorage
      const rawStorage = localStorage.getItem('lovable-surveys');
      if (rawStorage) {
        if (rawStorage.includes(specificSurveyId) || 
            (specificSurveyId.includes('survey-') && 
             rawStorage.includes(specificSurveyId.replace('survey-', '')))) {
          debugLog(`${specificSurveyId} EXISTS in raw localStorage string!`);
          
          try {
            const allSurveys = JSON.parse(rawStorage);
            debugLog('All available surveys after force parse:', 
              allSurveys.map((s: any) => s.id).join(', '));
            
            // Look for exact match first
            let targetSurvey = allSurveys.find((s: any) => s.id === specificSurveyId);
            
            // If not found, try partial match
            if (!targetSurvey) {
              const numericId = specificSurveyId.replace('survey-', '');
              targetSurvey = allSurveys.find((s: any) => 
                s.id.includes(numericId) || 
                (s.id.startsWith('survey-') && s.id.replace('survey-', '') === numericId)
              );
            }
            
            // Last resort - try any survey that might be similar
            if (!targetSurvey && allSurveys.length > 0) {
              debugLog('No exact match found, trying fuzzy match');
              // Try to find any partial match in either direction
              targetSurvey = allSurveys.find((s: any) => 
                (typeof s.id === 'string' && typeof specificSurveyId === 'string') && 
                (s.id.includes(specificSurveyId) || specificSurveyId.includes(s.id))
              );
              
              // If still nothing, just take the latest survey
              if (!targetSurvey && allSurveys.length > 0) {
                debugLog('No match found, using most recent survey');
                targetSurvey = allSurveys[allSurveys.length - 1];
              }
            }
            
            if (targetSurvey) {
              debugLog('FOUND TARGET SURVEY IN FORCE RECOVERY:', targetSurvey);
              
              const surveyToUse = JSON.parse(JSON.stringify(targetSurvey));
              
              // Handle various date formats
              if (surveyToUse.createdAt && typeof surveyToUse.createdAt !== 'object') {
                surveyToUse.createdAt = new Date(surveyToUse.createdAt);
              } else if (surveyToUse.createdAt?._type === 'Date') {
                surveyToUse.createdAt = new Date(surveyToUse.createdAt.value.iso);
              } else if (!surveyToUse.createdAt) {
                surveyToUse.createdAt = new Date();
              }
              
              // Refresh localStorage with consistently formatted data
              localStorage.setItem('lovable-surveys', JSON.stringify(allSurveys));
              debugLog('REFRESHED localStorage after force recovery');
              
              if (!silent) {
                toast({
                  title: "Survey Loaded",
                  description: `Successfully loaded "${surveyToUse.title}"`,
                });
              }
              
              return { surveyToUse, success: true };
            }
          } catch (parseError) {
            debugError('Error in force recovery parsing:', parseError);
          }
        }
      }
      
      // Last attempt - verify if any survey with similar ID exists 
      // in the context in case we missed it
      if (surveys.length > 0) {
        debugLog('Final attempt - checking all context surveys');
        const lastAttemptSurvey = surveys.find(s => 
          s.id.includes(specificSurveyId) || 
          specificSurveyId.includes(s.id)
        );
        
        if (lastAttemptSurvey) {
          debugLog('Found survey in final context check:', lastAttemptSurvey);
          return { surveyToUse: lastAttemptSurvey, success: true };
        }
        
        // If we're desperate and silent mode is on (automatic recovery)
        // use the most recent survey as fallback
        if (silent && surveys.length > 0) {
          const fallbackSurvey = surveys[surveys.length - 1];
          debugLog('Using fallback survey in silent mode:', fallbackSurvey);
          return { surveyToUse: fallbackSurvey, success: true };
        }
      }
      
      return { surveyToUse: null, success: false };
    } catch (error) {
      debugError('Error in force recovery:', error);
      return { surveyToUse: null, success: false };
    }
  }, [surveys, toast]);

  return { forceSurveyRecovery };
}
