
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Question from '@/components/Question';
import { Survey } from '@/types';
import AudioRecorder from '@/components/AudioRecorder';
import { Mic, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { debugLog } from '@/utils/debugUtils';

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
  const [transitioning, setTransitioning] = useState(false);
  
  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

  // Log audio blobs whenever they change
  useEffect(() => {
    debugLog('Current audioBlobs in SurveyQuestions:', Object.keys(audioBlobs).length);
  }, [audioBlobs]);

  const handleAudioRecorded = (audioBlob: Blob) => {
    if (!currentQuestion) return;
    
    debugLog(`Audio recorded for question ${currentQuestion.id}`);
    
    setAudioBlobs(prev => {
      const updated = {
        ...prev,
        [currentQuestion.id]: audioBlob
      };
      debugLog('Updated audioBlobs:', Object.keys(updated));
      return updated;
    });
    
    // We'll use a placeholder text for audio answers to maintain compatibility
    onAnswerChange(currentQuestion.id, "[Audio response recorded]");
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setTransitioning(false);
      }, 300);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setTransitioning(false);
      }, 300);
    }
  };
  
  // Check if current question has an audio answer
  const hasCurrentAnswer = () => {
    if (!currentQuestion) return false;
    
    // Check if this question has an audio recording
    const hasBlob = audioBlobs[currentQuestion.id] !== undefined;
    debugLog(`Checking current question ${currentQuestion.id} has answer:`, hasBlob);
    return hasBlob;
  };
  
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Check if all questions have audio answers
  const allQuestionsAnswered = () => {
    const result = survey.questions.every(question => {
      const hasAnswer = audioBlobs[question.id] !== undefined;
      debugLog(`Question ${question.id} has audio: ${hasAnswer}`);
      return hasAnswer;
    });
    debugLog('All questions answered:', result);
    return result;
  };

  // Submit handler that passes audioBlobs to parent
  const handleSubmit = () => {
    // Transfer audio blobs to parent component
    if (window.audioBlobs) {
      window.audioBlobs = audioBlobs;
    }
    
    debugLog('Submitting survey with audio blobs:', Object.keys(audioBlobs).length);
    onSubmit();
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{survey.title}</CardTitle>
        {survey.description && (
          <CardDescription>{survey.description}</CardDescription>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {survey.questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: transitioning ? 20 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
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
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-center text-sm text-green-600 dark:text-green-400 flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Audio response recorded successfully
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {!isFirstQuestion && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
        </div>
        
        <div>
          {!isLastQuestion ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button 
                      onClick={handleNext}
                      disabled={!hasCurrentAnswer()}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                {!hasCurrentAnswer() && (
                  <TooltipContent>
                    Please record an audio response before continuing
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!allQuestionsAnswered()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit Feedback
                    </Button>
                  </span>
                </TooltipTrigger>
                {!allQuestionsAnswered() && (
                  <TooltipContent>
                    Please record audio for all questions
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SurveyQuestions;
