
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Question from '@/components/Question';
import { Survey } from '@/types';
import AudioRecorder from '@/components/AudioRecorder';
import { Mic } from 'lucide-react';

interface SurveyQuestionsProps {
  survey: Survey;
  answers: {questionId: string, answer: string}[];
  onAnswerChange: (questionId: string, answer: string) => void;
  onSubmit: () => void;
}

const SurveyQuestions = ({ 
  survey, 
  answers, 
  onAnswerChange, 
  onSubmit 
}: SurveyQuestionsProps) => {
  const [audioBlobs, setAudioBlobs] = useState<{[key: string]: Blob}>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const currentQuestion = survey.questions[currentQuestionIndex];

  // Log audio blobs whenever they change
  useEffect(() => {
    console.log('Current audioBlobs in SurveyQuestions:', Object.keys(audioBlobs).length);
  }, [audioBlobs]);

  const handleAudioRecorded = (audioBlob: Blob) => {
    if (!currentQuestion) return;
    
    console.log(`Audio recorded for question ${currentQuestion.id}`);
    
    setAudioBlobs(prev => {
      const updated = {
        ...prev,
        [currentQuestion.id]: audioBlob
      };
      console.log('Updated audioBlobs:', Object.keys(updated));
      return updated;
    });
    
    // We'll use a placeholder text for audio answers to maintain compatibility
    onAnswerChange(currentQuestion.id, "[Audio response recorded]");
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Check if current question has an audio answer
  const hasCurrentAnswer = () => {
    if (!currentQuestion) return false;
    
    // Check if this question has an audio recording
    const hasBlob = audioBlobs[currentQuestion.id] !== undefined;
    console.log(`Checking current question ${currentQuestion.id} has answer:`, hasBlob);
    return hasBlob;
  };
  
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Check if all questions have audio answers
  const allQuestionsAnswered = () => {
    const result = survey.questions.every(question => {
      const hasAnswer = audioBlobs[question.id] !== undefined;
      console.log(`Question ${question.id} has audio: ${hasAnswer}`);
      return hasAnswer;
    });
    console.log('All questions answered:', result);
    return result;
  };

  // Submit handler that passes audioBlobs to parent
  const handleSubmit = () => {
    // Transfer audio blobs to parent component
    if (window.audioBlobs) {
      window.audioBlobs = audioBlobs;
    }
    
    console.log('Submitting survey with audio blobs:', Object.keys(audioBlobs).length);
    onSubmit();
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{survey.title}</CardTitle>
        {survey.description && (
          <CardDescription>{survey.description}</CardDescription>
        )}
        <div className="text-sm text-muted-foreground mt-2">
          Question {currentQuestionIndex + 1} of {survey.questions.length}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestion && (
          <div className="space-y-4">
            <Question 
              question={`${currentQuestionIndex + 1}. ${currentQuestion.text}`}
              description={currentQuestion.description}
            />
            
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Voice Response Required</span>
              </div>
              
              <AudioRecorder 
                onAudioRecorded={handleAudioRecorded} 
              />
              
              {hasCurrentAnswer() && (
                <div className="mt-2 text-center text-sm text-green-600 dark:text-green-400">
                  Audio response recorded successfully
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {!isFirstQuestion && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
            >
              Previous
            </Button>
          )}
        </div>
        
        <div>
          {!isLastQuestion ? (
            <Button 
              onClick={handleNext}
              disabled={!hasCurrentAnswer()}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered()}
            >
              Submit Feedback
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SurveyQuestions;
