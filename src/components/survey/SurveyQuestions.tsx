
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Question from '@/components/Question';
import { Survey } from '@/types';

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
  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{survey.title}</CardTitle>
        {survey.description && (
          <CardDescription>{survey.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-8">
        {survey.questions.map((question, index) => (
          <div key={question.id} className="space-y-4">
            <Question 
              question={`${index + 1}. ${question.text}`}
              description={question.description}
            />
            <Textarea 
              placeholder="Type your answer here..."
              value={answers.find(a => a.questionId === question.id)?.answer || ''}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              className="min-h-24"
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} className="w-full">Submit Feedback</Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyQuestions;
