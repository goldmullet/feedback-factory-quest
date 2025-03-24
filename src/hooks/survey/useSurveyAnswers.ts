
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Survey } from '@/types';
import { RespondentInfo } from '@/hooks/useRespondentForm';
import { validateSurveyResponse } from '@/utils/surveyUtils';

export function useSurveyAnswers() {
  const [answers, setAnswers] = useState<{questionId: string, answer: string}[]>([]);
  const { toast } = useToast();

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, answer } 
          : a
      )
    );
  };

  const validateAudioResponses = (survey: Survey | null, audioBlobs: {[key: string]: Blob} = {}) => {
    const audioRecordingsCount = Object.keys(audioBlobs).length;
    console.log('Audio recordings count:', audioRecordingsCount);
    console.log('Required questions count:', survey?.questions.length);
    
    if (audioRecordingsCount < (survey?.questions.length || 0)) {
      toast({
        title: "Missing Audio Responses",
        description: "Please record audio answers for all questions.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  return {
    answers,
    setAnswers,
    handleAnswerChange,
    validateAudioResponses
  };
}
