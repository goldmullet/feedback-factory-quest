
export interface Question {
  id: string;
  text: string;
  description?: string;
  brandId: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  description?: string;
}

export interface Survey {
  id: string;
  brandId: string;
  title: string;
  description: string;
  questions: {
    id: string;
    text: string;
    description: string;
  }[];
  createdAt: Date;
}

export interface Feedback {
  id: string;
  questionId: string;
  audioBlob: Blob;
  audioUrl: string;
  createdAt: Date;
  transcription?: string;
  insights?: string[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: {
    questionId: string;
    answer: string;
    transcription?: string;
    insights?: string[];
  }[];
  respondent?: {
    name: string;
    email: string;
  };
  audioUrls?: {
    [questionId: string]: string;
  };
  transcriptions?: {
    [questionId: string]: string;
  };
  insights?: {
    [questionId: string]: string[];
  };
  createdAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  questions: Question[];
  storeCredit: number;
}

export interface FeedbackContextType {
  brands: Brand[];
  questions: Question[];
  feedback: Feedback[];
  surveys: Survey[];
  surveyResponses: SurveyResponse[];
  addBrand: (name: string) => void;
  addQuestion: (brandId: string, text: string, description?: string) => void;
  addFeedback: (questionId: string, audioBlob: Blob) => void;
  addSurvey: (brandId: string, title: string, description: string, questions: {text: string, description: string}[]) => string;
  addSurveyResponse: (
    surveyId: string, 
    answers: {questionId: string, answer: string, transcription?: string, insights?: string[]}[], 
    respondent?: {name: string, email: string}, 
    audioBlobs?: {[key: string]: Blob}
  ) => void;
  getCurrentBrand: () => Brand | undefined;
  setCurrentBrandId: (id: string) => void;
}
