
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
  respondent?: {
    name: string;
    email: string;
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
  addSurveyResponse: (surveyId: string, answers: {questionId: string, answer: string}[], respondent?: {name: string, email: string}) => void;
  getCurrentBrand: () => Brand | undefined;
  setCurrentBrandId: (id: string) => void;
}
