
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Question from '@/components/Question';
import { Survey } from '@/types';
import AudioRecorder from '@/components/AudioRecorder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MessageSquare } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<string>("text");
  const [audioBlobs, setAudioBlobs] = useState<{[key: string]: Blob}>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const currentQuestion = survey.questions[currentQuestionIndex];

  const handleAudioRecorded = (audioBlob: Blob) => {
    if (!currentQuestion) return;
    
    setAudioBlobs(prev => ({
      ...prev,
      [currentQuestion.id]: audioBlob
    }));
    
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
  
  // Check if current question has an answer (text or audio)
  const hasCurrentAnswer = () => {
    if (!currentQuestion) return false;
    const textAnswer = answers.find(a => a.questionId === currentQuestion.id)?.answer;
    const audioAnswer = audioBlobs[currentQuestion.id];
    return (textAnswer && textAnswer.trim() !== '') || audioAnswer !== undefined;
  };
  
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Check if all questions have answers
  const allQuestionsAnswered = survey.questions.every(question => {
    const textAnswer = answers.find(a => a.questionId === question.id)?.answer;
    const audioAnswer = audioBlobs[question.id];
    return (textAnswer && textAnswer.trim() !== '') || audioAnswer !== undefined;
  });

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
            
            <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="text" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  Audio
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="mt-0">
                <Textarea 
                  placeholder="Type your answer here..."
                  value={answers.find(a => a.questionId === currentQuestion.id)?.answer || ''}
                  onChange={(e) => onAnswerChange(currentQuestion.id, e.target.value)}
                  className="min-h-24"
                />
              </TabsContent>
              
              <TabsContent value="audio" className="mt-0">
                <AudioRecorder 
                  onAudioRecorded={handleAudioRecorded} 
                />
                {audioBlobs[currentQuestion.id] && (
                  <div className="mt-2 text-center text-sm text-green-600 dark:text-green-400">
                    Audio response recorded successfully
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
              onClick={onSubmit}
              disabled={!allQuestionsAnswered}
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
