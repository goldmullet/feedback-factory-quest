
import { Survey } from '@/types';
import { useToast } from '@/hooks/use-toast';

/**
 * Attempts to find a survey by ID using various matching strategies
 */
export const findSurveyById = (
  surveyId: string | undefined,
  surveys: Survey[],
  setDirectLocalStorageCheck: (value: boolean) => void
): Survey | null => {
  console.log(`[Looking for survey] ${surveyId}`);
  
  if (!surveyId) {
    console.error('No surveyId provided in URL');
    return null;
  }

  console.log('Available surveys in context:', surveys.length);
  
  // Try URL decoding in case the ID was encoded
  const decodedSurveyId = decodeURIComponent(surveyId);
  const isEncoded = decodedSurveyId !== surveyId;
  
  if (isEncoded) {
    console.log(`Survey ID was URL encoded. Decoded from "${surveyId}" to "${decodedSurveyId}"`);
  }
  
  // For the specific problematic survey ID
  if (surveyId === 'survey-1742850890608' || decodedSurveyId === 'survey-1742850890608') {
    console.log('Looking for the specific problematic survey...');
    const targetSurvey = surveys.find(s => 
      s.id === 'survey-1742850890608' || 
      s.id.includes('1742850890608')
    );
    
    if (targetSurvey) {
      console.log('Found the target problematic survey in context:', targetSurvey);
      return targetSurvey;
    }
  }
  
  // First, try to find the survey with the exact ID in the context
  let foundSurvey = surveys.find(s => s.id === surveyId);
  
  // If not found, try with the decoded ID
  if (!foundSurvey && isEncoded) {
    console.log('Trying with decoded ID...');
    foundSurvey = surveys.find(s => s.id === decodedSurveyId);
  }
  
  // If still not found, try case-insensitive match in context
  if (!foundSurvey) {
    console.log('Trying case-insensitive match in context...');
    foundSurvey = surveys.find(s => 
      typeof s.id === 'string' && (
        s.id.toLowerCase() === surveyId.toLowerCase() ||
        (isEncoded && s.id.toLowerCase() === decodedSurveyId.toLowerCase())
      )
    );
  }
  
  // If still not found, try partial match
  if (!foundSurvey) {
    console.log('Trying partial match in context...');
    foundSurvey = surveys.find(s => 
      typeof s.id === 'string' && (
        s.id.includes(surveyId) || 
        surveyId.includes(s.id) ||
        (isEncoded && (s.id.includes(decodedSurveyId) || decodedSurveyId.includes(s.id)))
      )
    );
  }
  
  if (foundSurvey) {
    console.log('Survey found in context:', foundSurvey);
    return foundSurvey;
  }
  
  return null;
};

/**
 * Attempts to find a survey in localStorage
 */
export const findSurveyInLocalStorage = (
  surveyId: string | undefined,
  setDirectLocalStorageCheck: (value: boolean) => void
): Survey | null => {
  if (!surveyId) return null;
  
  // Try URL decoding in case the ID was encoded
  const decodedSurveyId = decodeURIComponent(surveyId);
  const isEncoded = decodedSurveyId !== surveyId;
  
  console.log('Survey not found in context, checking localStorage directly...');
  try {
    const storedSurveysRaw = localStorage.getItem('lovable-surveys');
    if (storedSurveysRaw) {
      console.log('Raw stored surveys from localStorage:', storedSurveysRaw);
      setDirectLocalStorageCheck(true);
      
      // Parse the stored surveys
      let storedSurveys;
      try {
        storedSurveys = JSON.parse(storedSurveysRaw);
        console.log('Number of surveys in localStorage:', storedSurveys.length);
        console.log('Available survey IDs:', storedSurveys.map((s: any) => s.id).join(', '));
        
        // First, check for the specific problematic survey ID
        if (surveyId === 'survey-1742850890608' || decodedSurveyId === 'survey-1742850890608') {
          console.log('Looking for the specific problematic survey in localStorage...');
          const targetSurvey = storedSurveys.find((s: any) => 
            s.id === 'survey-1742850890608' || 
            s.id.includes('1742850890608')
          );
          
          if (targetSurvey) {
            console.log('Found the target problematic survey in localStorage:', targetSurvey);
            
            // Deep clone to avoid reference issues
            const surveyToUse = JSON.parse(JSON.stringify(targetSurvey));
            
            // Convert createdAt to Date object
            if (surveyToUse.createdAt && typeof surveyToUse.createdAt !== 'object') {
              surveyToUse.createdAt = new Date(surveyToUse.createdAt);
            } else if (surveyToUse.createdAt?._type === 'Date') {
              surveyToUse.createdAt = new Date(surveyToUse.createdAt.value.iso);
            }
            
            console.log('Using target survey with processed date:', surveyToUse);
            return surveyToUse as Survey;
          }
        }
        
        // Check if our survey ID is in the localStorage data
        const exactMatch = storedSurveys.some((s: any) => s.id === surveyId);
        const decodedMatch = isEncoded && storedSurveys.some((s: any) => s.id === decodedSurveyId);
        const caseInsensitiveMatch = storedSurveys.some((s: any) => 
          typeof s.id === 'string' && (
            s.id.toLowerCase() === surveyId.toLowerCase() ||
            (isEncoded && s.id.toLowerCase() === decodedSurveyId.toLowerCase())
          )
        );
        const partialMatch = storedSurveys.some((s: any) => 
          typeof s.id === 'string' && (
            s.id.includes(surveyId) || 
            surveyId.includes(s.id) ||
            (isEncoded && (s.id.includes(decodedSurveyId) || decodedSurveyId.includes(s.id)))
          )
        );
        
        console.log(`Survey ID exact match in localStorage: ${exactMatch}`);
        console.log(`Survey ID decoded match in localStorage: ${decodedMatch}`);
        console.log(`Survey ID case-insensitive match in localStorage: ${caseInsensitiveMatch}`);
        console.log(`Survey ID partial match in localStorage: ${partialMatch}`);
        
      } catch (parseError) {
        console.error('Error parsing localStorage surveys:', parseError);
        return null;
      }
      
      // Try exact match
      let localStorageSurvey = storedSurveys.find((s: any) => s.id === surveyId);
      
      // If not found, try with decoded ID
      if (!localStorageSurvey && isEncoded) {
        console.log('Trying with decoded ID in localStorage...');
        localStorageSurvey = storedSurveys.find((s: any) => s.id === decodedSurveyId);
      }
      
      // If not found, try case-insensitive match
      if (!localStorageSurvey) {
        console.log('Trying case-insensitive match in localStorage...');
        localStorageSurvey = storedSurveys.find((s: any) => 
          typeof s.id === 'string' && (
            s.id.toLowerCase() === surveyId.toLowerCase() ||
            (isEncoded && s.id.toLowerCase() === decodedSurveyId.toLowerCase())
          )
        );
      }
      
      // If not found, try partial match
      if (!localStorageSurvey) {
        console.log('Trying partial match in localStorage...');
        localStorageSurvey = storedSurveys.find((s: any) => 
          typeof s.id === 'string' && (
            s.id.includes(surveyId) || 
            surveyId.includes(s.id) ||
            (isEncoded && (s.id.includes(decodedSurveyId) || decodedSurveyId.includes(s.id)))
          )
        );
      }
      
      if (localStorageSurvey) {
        console.log('Survey found in localStorage:', localStorageSurvey);
        
        // Deep clone to avoid reference issues
        const surveyToUse = JSON.parse(JSON.stringify(localStorageSurvey));
        
        // Convert createdAt to Date object if needed
        if (surveyToUse.createdAt && typeof surveyToUse.createdAt !== 'object') {
          surveyToUse.createdAt = new Date(surveyToUse.createdAt);
        } else if (surveyToUse.createdAt?._type === 'Date') {
          surveyToUse.createdAt = new Date(surveyToUse.createdAt.value.iso);
        }
        
        console.log('Using survey with processed date:', surveyToUse);
        
        return surveyToUse as Survey;
      } else {
        console.error('Survey not found in localStorage with ID:', surveyId);
        if (isEncoded) {
          console.error('Also tried with decoded ID:', decodedSurveyId);
        }
        console.log('Available survey IDs in localStorage:', storedSurveys.map((s: any) => s.id).join(', '));
      }
    } else {
      console.error('No surveys found in localStorage');
    }
  } catch (error) {
    console.error('Error accessing stored surveys:', error);
  }
  
  return null;
};

/**
 * Initialize answer objects from survey questions
 */
export const initializeAnswers = (surveyData: Survey) => {
  if (!surveyData.questions || !Array.isArray(surveyData.questions)) {
    console.error('Invalid survey questions data:', surveyData);
    return [];
  }
  
  return surveyData.questions.map(q => ({
    questionId: q.id,
    answer: ''
  }));
};

/**
 * Validates survey responses
 */
export const validateSurveyResponse = (
  answers: {questionId: string, answer: string}[],
  toast: ReturnType<typeof useToast>['toast']
): boolean => {
  // Validate that all questions have answers
  const unansweredQuestions = answers.filter(a => !a.answer.trim());
  
  if (unansweredQuestions.length > 0) {
    toast({
      title: "Missing answers",
      description: `Please answer all questions before submitting.`,
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};
