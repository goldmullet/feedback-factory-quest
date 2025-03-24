
import { useCallback } from 'react';
import { Survey } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useSurveyRecovery(surveys: Survey[]) {
  const { toast } = useToast();
  
  const forceSurveyRecovery = useCallback((specificSurveyId: string, silent: boolean = false) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Force recovery for survey: ${specificSurveyId}, silent: ${silent}`);
    }
    
    try {
      const rawStorage = localStorage.getItem('lovable-surveys');
      if (rawStorage) {
        if (rawStorage.includes(specificSurveyId)) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`${specificSurveyId} EXISTS in raw localStorage string!`);
          }
          
          try {
            const allSurveys = JSON.parse(rawStorage);
            if (process.env.NODE_ENV === 'development') {
              console.log('All available surveys after force parse:', 
                allSurveys.map((s: any) => s.id).join(', '));
            }
            
            const targetSurvey = allSurveys.find((s: any) => 
              s.id === specificSurveyId || 
              s.id.includes(specificSurveyId.replace('survey-', ''))
            );
            
            if (targetSurvey) {
              if (process.env.NODE_ENV === 'development') {
                console.log('FOUND TARGET SURVEY IN FORCE RECOVERY:', targetSurvey);
              }
              
              const surveyToUse = JSON.parse(JSON.stringify(targetSurvey));
              
              if (surveyToUse.createdAt && typeof surveyToUse.createdAt !== 'object') {
                surveyToUse.createdAt = new Date(surveyToUse.createdAt);
              } else if (surveyToUse.createdAt?._type === 'Date') {
                surveyToUse.createdAt = new Date(surveyToUse.createdAt.value.iso);
              } else if (surveyToUse.createdAt === undefined && surveyToUse.createdAt) {
                surveyToUse.createdAt = new Date(surveyToUse.createdAt);
                delete surveyToUse.createdAt;
              }
              
              localStorage.setItem('lovable-surveys', JSON.stringify(allSurveys));
              if (process.env.NODE_ENV === 'development') {
                console.log('REFRESHED localStorage after force recovery');
              }
              
              if (!silent) {
                toast({
                  title: "Survey Loaded",
                  description: `Successfully loaded "${surveyToUse.title}"`,
                });
              }
              
              return { surveyToUse, success: true };
            }
          } catch (parseError) {
            console.error('Error in force recovery parsing:', parseError);
          }
        }
      }
      
      const matchingSurvey = surveys.find(s => 
        s.id === specificSurveyId || 
        s.id.includes(specificSurveyId.replace('survey-', ''))
      );
      
      if (matchingSurvey) {
        if (process.env.NODE_ENV === 'development') {
          console.log('FOUND TARGET SURVEY IN CONTEXT:', matchingSurvey);
        }
        return { surveyToUse: matchingSurvey, success: true };
      }
      
      return { surveyToUse: null, success: false };
    } catch (error) {
      console.error('Error in force recovery:', error);
      return { surveyToUse: null, success: false };
    }
  }, [surveys, toast]);

  return { forceSurveyRecovery };
}
