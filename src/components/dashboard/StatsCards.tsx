
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  totalFeedback: number;
  storeCredit: number;
}

const StatsCards = ({ totalFeedback, storeCredit }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="glass-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalFeedback}</div>
          <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="glass-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-500">Neutral</div>
          <p className="text-xs text-muted-foreground mt-1">-2% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="glass-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Store Credit Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${storeCredit || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">$50 remaining in budget</p>
        </CardContent>
      </Card>
      
      <Card className="glass-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Key Issues Identified
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">8</div>
          <p className="text-xs text-muted-foreground mt-1">3 require immediate attention</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
