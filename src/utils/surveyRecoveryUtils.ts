
/**
 * Utility functions for survey recovery and troubleshooting
 */

// List of known problematic survey IDs
const PROBLEMATIC_SURVEY_IDS = [
  'survey-1742852600629', 
  'survey-1742852947140', 
  'survey-1742850890608',
  'survey-1742853415451',
  'survey-1743616937387', // Adding the new problematic ID from the shared link
];

/**
 * Checks if a survey ID is in the list of known problematic IDs
 * 
 * @param surveyId The survey ID to check
 * @returns True if the survey ID is known to be problematic
 */
export const isProblematicSurveyId = (surveyId: string): boolean => {
  // Check for exact match
  if (PROBLEMATIC_SURVEY_IDS.includes(surveyId)) {
    return true;
  }
  
  // Check if the numeric part is present in any problematic ID
  if (surveyId.includes('-')) {
    const numericPart = surveyId.split('-')[1];
    return PROBLEMATIC_SURVEY_IDS.some(id => id.includes(numericPart));
  }
  
  // Check if this ID is part of any problematic ID
  return PROBLEMATIC_SURVEY_IDS.some(id => 
    id.includes(surveyId) || surveyId.includes(id.replace('survey-', ''))
  );
};

/**
 * Gets all available survey IDs from localStorage
 * 
 * @returns Array of survey IDs or empty array if none found
 */
export const getAllAvailableSurveyIds = (): string[] => {
  try {
    const storedSurveysRaw = localStorage.getItem('lovable-surveys');
    if (storedSurveysRaw) {
      const allSurveys = JSON.parse(storedSurveysRaw);
      return allSurveys.map((s: any) => s.id);
    }
  } catch (error) {
    console.error('Error retrieving survey IDs from localStorage:', error);
  }
  return [];
};

/**
 * Fixes common encoding issues with survey IDs
 * 
 * @param surveyId The potentially problematic survey ID
 * @returns The fixed survey ID if possible, or the original if no fix is found
 */
export const fixSurveyIdEncoding = (surveyId: string): string => {
  // Try decoding in case the ID was encoded
  try {
    const decodedId = decodeURIComponent(surveyId);
    if (decodedId !== surveyId) {
      console.log(`Survey ID was URL encoded. Decoded: ${decodedId}`);
      return decodedId;
    }
  } catch (e) {
    // Ignore decoding errors
  }
  
  // Check if the ID is missing the 'survey-' prefix
  if (!surveyId.startsWith('survey-') && !isNaN(Number(surveyId))) {
    return `survey-${surveyId}`;
  }
  
  return surveyId;
};
