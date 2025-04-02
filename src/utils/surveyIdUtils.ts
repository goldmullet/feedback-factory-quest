
/**
 * Utilities for handling survey ID formatting and validation
 */

/**
 * Fixes common encoding issues with survey IDs
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

/**
 * Identifies problems or potential issues with a survey ID
 * 
 * @param surveyId The survey ID to check
 * @returns Object with diagnostic information
 */
export const analyzeSurveyId = (surveyId: string) => {
  const hasPrefix = surveyId.startsWith('survey-');
  const numericPart = hasPrefix ? surveyId.split('-')[1] : surveyId;
  const isNumeric = !isNaN(Number(numericPart));
  
  return {
    hasPrefix,
    numericPart,
    isNumeric,
    needsFixing: !hasPrefix && isNumeric,
  };
};
