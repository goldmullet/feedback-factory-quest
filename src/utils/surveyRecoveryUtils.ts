
import { debugLog } from './debugUtils';

/**
 * Check if the survey ID is one of the known problematic ones
 */
export const isProblematicSurveyId = (surveyId?: string): boolean => {
  if (!surveyId) return false;
  
  const problematicSurveyIds = [
    'survey-1742852600629', 
    'survey-1742852947140', 
    'survey-1742850890608',
    'survey-1742853415451'
  ];
  
  return problematicSurveyIds.some(id => 
    surveyId === id || surveyId?.includes(id.replace('survey-', ''))
  );
};

/**
 * Helper to check and attempt recovery for surveys in localStorage
 */
export const checkLocalStorageSurveys = (surveyId?: string): void => {
  if (!surveyId) return;
  
  try {
    const storedSurveysRaw = localStorage.getItem('lovable-surveys');
    if (storedSurveysRaw) {
      debugLog('All available surveys in localStorage:', JSON.parse(storedSurveysRaw).map((s: any) => s.id).join(', '));
      const exactMatch = JSON.parse(storedSurveysRaw).some((s: any) => s.id === surveyId);
      debugLog(`Manual check - Survey ID exact match in localStorage: ${exactMatch}`);
      
      // Special silent handling for specific problematic survey IDs
      if (isProblematicSurveyId(surveyId)) {
        const idToCheck = surveyId;
        debugLog(`ATTEMPTING SILENT RECOVERY for ${idToCheck}`);
        
        // Look for this specific ID in localStorage
        const targetSurvey = JSON.parse(storedSurveysRaw).find((s: any) => 
          s.id === idToCheck || 
          s.id.includes(idToCheck.replace('survey-', ''))
        );
        
        if (targetSurvey) {
          debugLog('FOUND TARGET SURVEY:', targetSurvey);
          
          // Force the update of localStorage to ensure it's properly formatted
          try {
            let updatedSurveys = [...JSON.parse(storedSurveysRaw)];
            localStorage.setItem('lovable-surveys', JSON.stringify(updatedSurveys));
            debugLog('REFRESHED localStorage');
          } catch (e) {
            console.error('Failed to refresh localStorage:', e);
          }
        }
      }
    } else {
      debugLog('NO SURVEYS found in localStorage');
    }
  } catch (error) {
    debugLog('Error in manual localStorage check:', error);
  }
};
