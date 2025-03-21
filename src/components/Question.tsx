
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface QuestionProps {
  question: string;
  description?: string;
  editable?: boolean;
  onQuestionChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
}

const Question = ({ 
  question, 
  description, 
  editable = false,
  onQuestionChange,
  onDescriptionChange
}: QuestionProps) => {
  return (
    <Card className="border-none shadow-none glass-effect animate-fade-in">
      <CardHeader className="pb-2">
        {editable ? (
          <textarea
            className="w-full text-3xl md:text-4xl font-bold tracking-tight bg-transparent border-b border-gray-200 focus:border-primary focus:ring-0 resize-none"
            value={question}
            onChange={(e) => onQuestionChange?.(e.target.value)}
            rows={2}
            placeholder="Enter your question here..."
          />
        ) : (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{question}</h2>
        )}
      </CardHeader>
      {(description || editable) && (
        <CardContent>
          {editable ? (
            <textarea
              className="w-full text-lg text-muted-foreground bg-transparent border-b border-gray-200 focus:border-primary focus:ring-0 resize-none"
              value={description || ''}
              onChange={(e) => onDescriptionChange?.(e.target.value)}
              rows={2}
              placeholder="Add a description (optional)"
            />
          ) : (
            description && <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default Question;
