
import { Survey, SurveyResponse } from '@/types';

export const createSurvey = (
  brandId: string, 
  title: string, 
  description: string, 
  questions: {text: string, description: string}[]
): Survey => {
  // Generate a reliable survey ID using the current timestamp
  const timestamp = Date.now();
  const surveyId = `survey-${timestamp}`;
  
  // Log the creation for debugging
  console.log(`Creating survey with ID: ${surveyId}`);
  
  // Create and return the survey object
  return {
    id: surveyId,
    brandId,
    title,
    description,
    questions: questions.map(q => ({
      id: `sq-${timestamp}-${Math.random().toString(36).substring(2, 10)}`,
      text: q.text,
      description: q.description
    })),
    createdAt: new Date()
  };
};

export const createSurveyResponse = (
  surveyId: string, 
  answers: {questionId: string, answer: string, transcription?: string, insights?: string[]}[],
  respondent?: {name: string, email: string},
  audioBlobs?: {[key: string]: Blob}
): SurveyResponse => {
  const responseId = `response-${Date.now()}`;
  console.log(`Creating survey response with ID ${responseId} for survey ${surveyId}`);
  console.log('Answers:', answers);
  
  const response: SurveyResponse = {
    id: responseId,
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
  
  // Store AI processed transcriptions and insights if available
  const transcriptions: {[key: string]: string} = {};
  const insights: {[key: string]: string[]} = {};
  
  answers.forEach(answer => {
    if (answer.transcription) {
      transcriptions[answer.questionId] = answer.transcription;
    }
    
    if (answer.insights && answer.insights.length > 0) {
      insights[answer.questionId] = answer.insights;
    }
  });
  
  if (Object.keys(transcriptions).length > 0) {
    response.transcriptions = transcriptions;
  }
  
  if (Object.keys(insights).length > 0) {
    response.insights = insights;
  }
  
  return response;
};

/**
 * Save a survey to localStorage to ensure it persists
 */
export const persistSurveyToLocalStorage = (survey: Survey): void => {
  try {
    // First get existing surveys
    const storedSurveysRaw = localStorage.getItem('lovable-surveys');
    let allSurveys: Survey[] = [];
    
    if (storedSurveysRaw) {
      allSurveys = JSON.parse(storedSurveysRaw);
    }
    
    // Check if this survey already exists
    const existingIndex = allSurveys.findIndex(s => s.id === survey.id);
    if (existingIndex >= 0) {
      // Update existing survey
      allSurveys[existingIndex] = survey;
    } else {
      // Add new survey
      allSurveys.push(survey);
    }
    
    // Save to localStorage
    localStorage.setItem('lovable-surveys', JSON.stringify(allSurveys));
    console.log(`Survey ${survey.id} saved to localStorage successfully`);
  } catch (error) {
    console.error('Error saving survey to localStorage:', error);
  }
};
