
/**
 * Utilities for handling survey ID formatting and validation
 */

/**
 * Fixes common encoding issues with survey IDs
 * @param surveyId The potentially problematic survey ID
 * @returns The fixed survey ID if possible, or the original if no fix is found
 */
export const fixSurveyIdEncoding = (surveyId: string): string => {
  if (!surveyId) return '';
  
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
  
  // Clean any unexpected characters that might cause issues
  const cleanedId = surveyId.replace(/[^\w\d-]/g, '');
  if (cleanedId !== surveyId) {
    console.log(`Cleaned survey ID: ${cleanedId}`);
    return cleanedId;
  }
  
  return surveyId;
};

/**
 * Identifies problems or potential issues with a survey ID
 * 
 * @param surveyId The survey ID to check
 * @returns Object with diagnostic information
 */
export const analyzeSurveyId = (surveyId: string) => {
  if (!surveyId) return { hasPrefix: false, numericPart: '', isNumeric: false, needsFixing: false };
  
  const hasPrefix = surveyId.startsWith('survey-');
  const numericPart = hasPrefix ? surveyId.split('-')[1] : surveyId;
  const isNumeric = !isNaN(Number(numericPart));
  const hasUnexpectedChars = /[^\w\d-]/.test(surveyId);
  
  return {
    hasPrefix,
    numericPart,
    isNumeric,
    hasUnexpectedChars,
    needsFixing: !hasPrefix && isNumeric || hasUnexpectedChars,
  };
};

/**
 * Gets all recent problematic survey IDs
 * Returns the most recent problematic survey IDs for recovery
 */
export const getRecentProblemSurveyIds = (): string[] => {
  return [
    'survey-1743617288829',
    'survey-1743616937387',
    'survey-1742853415451'
  ];
};
