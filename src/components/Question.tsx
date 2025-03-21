
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface QuestionProps {
  question: string;
  description?: string;
}

const Question = ({ question, description }: QuestionProps) => {
  return (
    <Card className="border-none shadow-none glass-effect animate-fade-in">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-semibold tracking-tight">{question}</h2>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      )}
    </Card>
  );
};

export default Question;
