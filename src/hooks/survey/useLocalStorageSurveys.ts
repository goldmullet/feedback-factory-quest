
import { useState, useCallback } from 'react';
import { Survey } from '@/types';
import { isProblematicSurveyId } from '@/utils/surveyRecoveryUtils';
import { fixSurveyIdEncoding } from '@/utils/surveyIdUtils';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/utils/debugUtils';

export function useLocalStorageSurveys() {
  const [directLocalStorageCheck, setDirectLocalStorageCheck] = useState(false);
  const { toast } = useToast();

  /**
   * Find a survey in the provided array by ID
   */
  const findSurveyById = useCallback((
    surveyId: string, 
    surveys: Survey[], 
    updateCheckStatus?: React.Dispatch<React.SetStateAction<boolean>>
  ): Survey | null => {
    // Use updated ID if provided
    const normalizedId = fixSurveyIdEncoding(surveyId);
    
    // Search for the survey in the provided array
    const foundSurvey = surveys.find(s => s.id === normalizedId);
    
    if (foundSurvey) {
      debugLog(`Found survey with ID ${normalizedId} in provided surveys array`);
      if (updateCheckStatus) updateCheckStatus(false);
      return foundSurvey;
    }
    
    if (updateCheckStatus) updateCheckStatus(true);
    return null;
  }, []);

  /**
   * Find a survey directly in localStorage
   */
  const findSurveyInLocalStorage = useCallback((
    surveyId: string,
    updateCheckStatus?: React.Dispatch<React.SetStateAction<boolean>>
  ): Survey | null => {
    try {
      if (updateCheckStatus) updateCheckStatus(true);
      const storedSurveysRaw = localStorage.getItem('lovable-surveys');
      
      if (!storedSurveysRaw) {
        debugLog('No surveys found in localStorage');
        return null;
      }
      
      const allSurveys = JSON.parse(storedSurveysRaw);
      debugLog(`Found ${allSurveys.length} surveys in localStorage`);
      
      // Normalize the ID
      const normalizedId = fixSurveyIdEncoding(surveyId);
      
      // First try exact match
      let foundSurvey = allSurveys.find((s: any) => s.id === normalizedId);
      
      // Then try normalized search (partial matches)
      if (!foundSurvey && normalizedId.includes('-')) {
        const numericPart = normalizedId.split('-')[1];
        foundSurvey = allSurveys.find((s: any) => 
          s.id.includes(numericPart) || 
          (s.id.startsWith('survey-') && s.id.replace('survey-', '') === numericPart)
        );
      }
      
      if (foundSurvey) {
        const surveyToUse = JSON.parse(JSON.stringify(foundSurvey));
        
        // Fix date format if needed
        if (surveyToUse.createdAt && typeof surveyToUse.createdAt !== 'object') {
          surveyToUse.createdAt = new Date(surveyToUse.createdAt);
        } else if (surveyToUse.createdAt?._type === 'Date') {
          surveyToUse.createdAt = new Date(surveyToUse.createdAt.value.iso);
        }
        
        debugLog(`Found survey in localStorage: ${surveyToUse.id}`);
        return surveyToUse;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    return null;
  }, []);

  /**
   * Get all available survey IDs from localStorage
   */
  const getAllAvailableSurveyIds = useCallback((): string[] => {
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
  }, []);
  
  /**
   * Enhanced search for a survey across multiple methods
   */
  const searchForSurvey = useCallback((surveyId: string, surveys: Survey[]): Survey | null => {
    // First check direct match in provided surveys
    const directMatch = findSurveyById(surveyId, surveys, setDirectLocalStorageCheck);
    if (directMatch) return directMatch;
    
    // Try with decoded version if needed
    const decodedSurveyId = decodeURIComponent(surveyId);
    if (decodedSurveyId !== surveyId) {
      debugLog(`Trying with decoded ID: ${decodedSurveyId}`);
      const decodedMatch = findSurveyById(decodedSurveyId, surveys, setDirectLocalStorageCheck);
      if (decodedMatch) return decodedMatch;
    }
    
    // Try localStorage
    const localStorageMatch = findSurveyInLocalStorage(surveyId, setDirectLocalStorageCheck);
    if (localStorageMatch) return localStorageMatch;
    
    // Try localStorage with decoded ID
    if (decodedSurveyId !== surveyId) {
      const decodedLocalStorageMatch = findSurveyInLocalStorage(decodedSurveyId, setDirectLocalStorageCheck);
      if (decodedLocalStorageMatch) return decodedLocalStorageMatch;
    }
    
    return null;
  }, [findSurveyById, findSurveyInLocalStorage]);
  
  return {
    directLocalStorageCheck,
    setDirectLocalStorageCheck,
    findSurveyById,
    findSurveyInLocalStorage,
    getAllAvailableSurveyIds,
    searchForSurvey
  };
}
