
import { useState, ReactNode, useEffect } from 'react';
import FeedbackContext from './FeedbackContext';
import { Brand, Question, Feedback, Survey, SurveyResponse } from '@/types';
import { createBrand, addStoreCreditToBrand } from './brandUtils';
import { createQuestion, createFeedback, processFeedback } from './feedbackUtils';
import { createSurvey, createSurveyResponse } from './surveyUtils';

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
    const newBrand = createBrand(name);
    setBrands(prev => [...prev, newBrand]);
  };

  const addQuestion = (brandId: string, text: string, description?: string) => {
    const newQuestion = createQuestion(brandId, text, description);
    setQuestions(prev => [...prev, newQuestion]);
  };

  const addFeedback = (questionId: string, audioBlob: Blob) => {
    const newFeedback = createFeedback(questionId, audioBlob);
    setFeedback(prev => [...prev, newFeedback]);
    
    setTimeout(() => {
      setFeedback(prev =>
        prev.map(item =>
          item.id === newFeedback.id
            ? processFeedback(item)
            : item
        )
      );
    }, 2000);
  };

  const addSurvey = (brandId: string, title: string, description: string, questionsList: {text: string, description: string}[]) => {
    const newSurvey = createSurvey(brandId, title, description, questionsList);
    setSurveys(prev => [...prev, newSurvey]);
    return newSurvey.id;
  };

  const addSurveyResponse = (surveyId: string, answers: {questionId: string, answer: string}[], respondent?: {name: string, email: string}) => {
    const newResponse = createSurveyResponse(surveyId, answers, respondent);
    setSurveyResponses(prev => [...prev, newResponse]);
    
    if (respondent && respondent.email) {
      const survey = surveys.find(s => s.id === surveyId);
      if (survey) {
        setBrands(prev => addStoreCreditToBrand(prev, survey.brandId, 10));
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
