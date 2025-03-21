
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
  description?: string;
  questions: SurveyQuestion[];
  createdAt: Date;
}

export interface Feedback {
  id: string;
  questionId: string;
  audioBlob: Blob;
  audioUrl: string;
  transcription?: string;
  insights?: string[];
  createdAt: Date;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
  createdAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  questions: Question[];
  storeCredit: number;
}
