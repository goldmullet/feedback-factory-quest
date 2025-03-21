
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, LineChart } from 'lucide-react';

const FeedbackCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Feedback by Question</CardTitle>
          <CardDescription>
            Distribution of feedback received per question
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Chart visualization will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Feedback Over Time</CardTitle>
          <CardDescription>
            Weekly feedback volume trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Chart visualization will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackCharts;
