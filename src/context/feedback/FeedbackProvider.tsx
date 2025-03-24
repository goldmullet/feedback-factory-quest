
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
  const [currentBrandId, setCurrentBrandId] = useState<string>('brand-1');

  // Use a custom serializer for surveys to handle Date objects properly
  const [surveys, setSurveys] = useState<Survey[]>(() => {
    const storedSurveys = localStorage.getItem('lovable-surveys');
    if (storedSurveys) {
      try {
        // Parse stored surveys and convert createdAt strings back to Date objects
        const parsedSurveys = JSON.parse(storedSurveys);
        return parsedSurveys.map((survey: any) => ({
          ...survey,
          createdAt: survey.createdAt?._type === 'Date' 
            ? new Date(survey.createdAt.value.iso) 
            : new Date(survey.createdAt)
        }));
      } catch (error) {
        console.error('Error parsing stored surveys:', error);
        return [];
      }
    }
    return [];
  });

  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>(() => {
    const storedResponses = localStorage.getItem('lovable-survey-responses');
    if (storedResponses) {
      try {
        // Parse stored responses and convert createdAt strings back to Date objects
        const parsedResponses = JSON.parse(storedResponses);
        return parsedResponses.map((response: any) => ({
          ...response,
          createdAt: response.createdAt?._type === 'Date'
            ? new Date(response.createdAt.value.iso)
            : new Date(response.createdAt)
        }));
      } catch (error) {
        console.error('Error parsing stored survey responses:', error);
        return [];
      }
    }
    return [];
  });

  // Custom JSON replacer to handle Date objects when saving to localStorage
  const jsonReplacer = (key: string, value: any) => {
    if (value instanceof Date) {
      return {
        _type: 'Date',
        value: {
          iso: value.toISOString(),
          value: value.valueOf(),
          local: value.toString()
        }
      };
    }
    return value;
  };

  // Save surveys to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('lovable-surveys', JSON.stringify(surveys, jsonReplacer));
      console.log('Saved surveys to localStorage:', surveys);
    } catch (error) {
      console.error('Error saving surveys to localStorage:', error);
    }
  }, [surveys]);

  // Save survey responses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('lovable-survey-responses', JSON.stringify(surveyResponses, jsonReplacer));
      console.log('Saved survey responses to localStorage:', surveyResponses);
    } catch (error) {
      console.error('Error saving survey responses to localStorage:', error);
    }
  }, [surveyResponses]);

  // Add a debug survey response if none exist (for development purposes)
  useEffect(() => {
    if (surveyResponses.length === 0 && surveys.length > 0) {
      console.log('No survey responses found, creating a sample response for debugging');
      
      // Find the first survey to add a sample response to
      const firstSurvey = surveys[0];
      if (firstSurvey) {
        const sampleResponse: SurveyResponse = {
          id: `response-debug-${Date.now()}`,
          surveyId: firstSurvey.id,
          answers: firstSurvey.questions.map(q => ({
            questionId: q.id,
            answer: 'Sample response text',
            transcription: 'This is a sample transcription from the AI system.',
            insights: ['Quality concern', 'Price too high', 'Better alternatives available']
          })),
          respondent: {
            name: 'Sample User',
            email: 'sample@example.com'
          },
          transcriptions: {},
          insights: {},
          createdAt: new Date()
        };
        
        // Add sample transcriptions and insights
        firstSurvey.questions.forEach(q => {
          if (sampleResponse.transcriptions) {
            sampleResponse.transcriptions[q.id] = 'This is a sample transcription from the AI system.';
          }
          
          if (sampleResponse.insights) {
            sampleResponse.insights[q.id] = ['Quality concern', 'Price too high', 'Better alternatives available'];
          }
        });
        
        setSurveyResponses(prev => [...prev, sampleResponse]);
        console.log('Added sample survey response:', sampleResponse);
      }
    }
  }, [surveys, surveyResponses]);

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
    
    console.log('Created new survey:', newSurvey);
    
    return newSurvey.id;
  };

  const addSurveyResponse = (
    surveyId: string, 
    answers: {questionId: string, answer: string, transcription?: string, insights?: string[]}[], 
    respondent?: {name: string, email: string},
    audioBlobs?: {[key: string]: Blob}
  ) => {
    const newResponse = createSurveyResponse(surveyId, answers, respondent, audioBlobs);
    console.log('Creating new survey response:', newResponse);
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
