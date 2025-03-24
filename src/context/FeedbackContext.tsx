import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Question {
  id: string;
  text: string;
  description?: string;
  brandId: string;
}

interface Feedback {
  id: string;
  questionId: string;
  audioBlob: Blob;
  audioUrl: string;
  transcription?: string;
  insights?: string[];
  createdAt: Date;
}

interface SurveyQuestion {
  id: string;
  text: string;
  description?: string;
}

interface Survey {
  id: string;
  brandId: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  createdAt: Date;
}

interface SurveyResponse {
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

interface Brand {
  id: string;
  name: string;
  questions: Question[];
  storeCredit: number;
}

interface FeedbackContextType {
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

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: 'brand-1',
      name: 'Acme E-commerce',
      questions: [],
      storeCredit: 500
    }
  ]);
  
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'question-1',
      text: 'Why did you return this product?',
      description: 'We value your honest feedback to improve our products.',
      brandId: 'brand-1'
    },
    {
      id: 'question-2',
      text: 'Why did you cancel your subscription?',
      description: 'We\'d like to understand what went wrong.',
      brandId: 'brand-1'
    }
  ]);
  
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [currentBrandId, setCurrentBrandId] = useState<string>('brand-1');

  const [surveys, setSurveys] = useState<Survey[]>(() => {
    const storedSurveys = localStorage.getItem('lovable-surveys');
    return storedSurveys ? JSON.parse(storedSurveys) : [];
  });

  useEffect(() => {
    localStorage.setItem('lovable-surveys', JSON.stringify(surveys));
  }, [surveys]);

  const addBrand = (name: string) => {
    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name,
      questions: [],
      storeCredit: 100
    };
    
    setBrands(prev => [...prev, newBrand]);
  };

  const addQuestion = (brandId: string, text: string, description?: string) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text,
      description,
      brandId
    };
    
    setQuestions(prev => [...prev, newQuestion]);
  };

  const addFeedback = (questionId: string, audioBlob: Blob) => {
    const url = URL.createObjectURL(audioBlob);
    
    const newFeedback: Feedback = {
      id: `feedback-${Date.now()}`,
      questionId,
      audioBlob,
      audioUrl: url,
      createdAt: new Date()
    };
    
    setFeedback(prev => [...prev, newFeedback]);
    
    setTimeout(() => {
      setFeedback(prev =>
        prev.map(item =>
          item.id === newFeedback.id
            ? {
                ...item,
                transcription: "I returned the product because it was smaller than I expected. The dimensions were unclear on the product page. Otherwise, the quality seemed good, but it just wasn't what I needed for my specific purpose.",
                insights: [
                  "Product size issue",
                  "Unclear product dimensions",
                  "Good product quality",
                  "Did not meet specific needs"
                ]
              }
            : item
        )
      );
    }, 2000);
  };

  const addSurvey = (brandId: string, title: string, description: string, questionsList: {text: string, description: string}[]) => {
    const surveyId = `survey-${Date.now()}`;
    
    const surveyQuestions: SurveyQuestion[] = questionsList.map(q => ({
      id: `sq-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: q.text,
      description: q.description
    }));
    
    const newSurvey: Survey = {
      id: surveyId,
      brandId,
      title,
      description,
      questions: surveyQuestions,
      createdAt: new Date()
    };
    
    setSurveys(prev => [...prev, newSurvey]);
    return surveyId;
  };

  const addSurveyResponse = (surveyId: string, answers: {questionId: string, answer: string}[], respondent?: {name: string, email: string}) => {
    const newResponse: SurveyResponse = {
      id: `response-${Date.now()}`,
      surveyId,
      answers,
      respondent,
      createdAt: new Date()
    };
    
    setSurveyResponses(prev => [...prev, newResponse]);
    
    if (respondent && respondent.email) {
      const survey = surveys.find(s => s.id === surveyId);
      if (survey) {
        setBrands(prev => 
          prev.map(brand => 
            brand.id === survey.brandId 
              ? { ...brand, storeCredit: brand.storeCredit + 10 }
              : brand
          )
        );
      }
    }
  };

  const getCurrentBrand = () => {
    return brands.find(brand => brand.id === currentBrandId);
  };

  const value = {
    brands,
    questions,
    feedback,
    surveys,
    surveyResponses,
    addBrand,
    addQuestion,
    addFeedback,
    addSurvey,
    addSurveyResponse,
    getCurrentBrand,
    setCurrentBrandId
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};
