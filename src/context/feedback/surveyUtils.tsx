
import { Survey, SurveyResponse } from '@/types';

export const createSurvey = (
  brandId: string, 
  title: string, 
  description: string, 
  questions: {text: string, description: string}[]
): Survey => {
  const surveyId = `survey-${Date.now()}`;
  
  return {
    id: surveyId,
    brandId,
    title,
    description,
    questions: questions.map(q => ({
      id: `sq-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      text: q.text,
      description: q.description
    })),
    createdAt: new Date()
  };
};

export const createSurveyResponse = (
  surveyId: string, 
  answers: {questionId: string, answer: string}[],
  respondent?: {name: string, email: string},
  audioBlobs?: {[key: string]: Blob}
): SurveyResponse => {
  const response: SurveyResponse = {
    id: `response-${Date.now()}`,
    surveyId,
    answers,
    createdAt: new Date()
  };

  if (respondent) {
    response.respondent = respondent;
  }
  
  // Convert audio blobs to URLs and store them
  if (audioBlobs) {
    const audioUrls: {[key: string]: string} = {};
    
    Object.entries(audioBlobs).forEach(([questionId, blob]) => {
      audioUrls[questionId] = URL.createObjectURL(blob);
    });
    
    response.audioUrls = audioUrls;
  }
  
  return response;
};
