
import { Question, Feedback } from '@/types';

export const createQuestion = (brandId: string, text: string, description?: string): Question => {
  return {
    id: `question-${Date.now()}`,
    text,
    description,
    brandId
  };
};

export const createFeedback = (questionId: string, audioBlob: Blob): Feedback => {
  const url = URL.createObjectURL(audioBlob);
  
  return {
    id: `feedback-${Date.now()}`,
    questionId,
    audioBlob,
    audioUrl: url,
    createdAt: new Date()
  };
};

export const processFeedback = (feedback: Feedback): Feedback => {
  return {
    ...feedback,
    transcription: "I returned the product because it was smaller than I expected. The dimensions were unclear on the product page. Otherwise, the quality seemed good, but it just wasn't what I needed for my specific purpose.",
    insights: [
      "Product size issue",
      "Unclear product dimensions",
      "Good product quality",
      "Did not meet specific needs"
    ]
  };
};
