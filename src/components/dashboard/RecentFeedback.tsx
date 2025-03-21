
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, MessageSquare } from 'lucide-react';
import { Feedback, Question } from '@/types';

interface RecentFeedbackProps {
  feedback: Feedback[];
  questions: Question[];
}

const RecentFeedback = ({ feedback, questions }: RecentFeedbackProps) => {
  // Get most recent feedback for display
  const recentFeedback = [...feedback]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
        <CardDescription>
          Last 5 feedback submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentFeedback.length > 0 ? (
          <div className="space-y-6">
            {recentFeedback.map(item => {
              const question = questions.find(q => q.id === item.questionId);
              return (
                <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{question?.text || 'Unknown Question'}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.createdAt.toLocaleDateString()} at {item.createdAt.toLocaleTimeString()}
                      </p>
                      {item.transcription ? (
                        <p className="text-sm">{item.transcription}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Transcription in progress...</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {item.insights && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.insights.map((insight, i) => (
                        <div key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {insight}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <p className="text-muted-foreground">No feedback received yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentFeedback;
