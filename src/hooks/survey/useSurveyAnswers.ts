
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Survey } from '@/types';
import { RespondentInfo } from '@/hooks/useRespondentForm';
import { validateSurveyResponse } from '@/utils/surveyUtils';
import { debugLog } from '@/utils/debugUtils';

export function useSurveyAnswers() {
  const [answers, setAnswers] = useState<{questionId: string, answer: string}[]>([]);
  const { toast } = useToast();

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => {
      // Check if this question already has an answer
      const exists = prev.some(a => a.questionId === questionId);
      
      if (exists) {
        return prev.map(a => a.questionId === questionId ? { ...a, answer } : a);
      } else {
        return [...prev, { questionId, answer }];
      }
    });
  };

  const validateAudioResponses = (survey: Survey | null, audioBlobs: {[key: string]: Blob} = {}) => {
    if (!survey) return false;
    
    const audioRecordingsCount = Object.keys(audioBlobs).length;
    debugLog('Audio recordings count:', audioRecordingsCount);
    debugLog('Required questions count:', survey?.questions.length);
    
    // Check if we have an audio recording for every question
    if (audioRecordingsCount < survey.questions.length) {
      // Identify which questions are missing audio responses
      const missingQuestions = survey.questions.filter(q => 
        !Object.keys(audioBlobs).includes(q.id)
      );
      
      let missingMessage = "Missing audio for:";
      if (missingQuestions.length <= 2) {
        missingMessage += " " + missingQuestions.map(q => 
          `Question ${survey.questions.findIndex(sq => sq.id === q.id) + 1}`
        ).join(", ");
      } else {
        missingMessage += ` ${missingQuestions.length} questions`;
      }
      
      toast({
        title: "Missing Audio Responses",
        description: missingMessage,
        variant: "destructive"
      });
      return false;
    }
    
    // Check if any audio recordings are too short (less than 1 second)
    const shortAudioRecordings = Object.entries(audioBlobs).filter(([_, blob]) => 
      blob.size < 1000 // Very rough estimate - small blobs may be too short
    );
    
    if (shortAudioRecordings.length > 0) {
      toast({
        title: "Audio Responses Too Short",
        description: `Please provide more detailed responses for ${shortAudioRecordings.length} question(s).`,
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
