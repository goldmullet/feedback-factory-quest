
import { Survey, SurveyQuestion, SurveyResponse } from '@/types';

export const createSurveyQuestion = (text: string, description: string): SurveyQuestion => {
  return {
    id: `sq-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    text,
    description
  };
};

export const createSurvey = (
  brandId: string, 
  title: string, 
  description: string, 
  questionsList: {text: string, description: string}[]
): Survey => {
  // Create a simpler, more reliable ID format
  const surveyId = `survey-${Date.now()}`;
  
  const surveyQuestions = questionsList.map(q => createSurveyQuestion(q.text, q.description));
  
  return {
    id: surveyId,
    brandId,
    title,
    description,
    questions: surveyQuestions,
    createdAt: new Date()
  };
};

export const createSurveyResponse = (
  surveyId: string, 
  answers: {questionId: string, answer: string}[], 
  respondent?: {name: string, email: string}
): SurveyResponse => {
  return {
    id: `response-${Date.now()}`,
    surveyId,
    answers,
    respondent,
    createdAt: new Date()
  };
};
