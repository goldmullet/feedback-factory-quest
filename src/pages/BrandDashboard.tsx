
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFeedback } from '@/context/FeedbackContext';
import { BarChart, LineChart, CircleHelp, AlertTriangle, Award, MessageSquare, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BrandDashboard = () => {
  const { feedback, questions, getCurrentBrand } = useFeedback();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const currentBrand = getCurrentBrand();
  
  // Calculate statistics
  const totalFeedback = feedback.length;
  const feedbackByQuestion = questions.map(question => {
    const count = feedback.filter(f => f.questionId === question.id).length;
    return {
      questionId: question.id,
      questionText: question.text,
      count
    };
  });
  
  // Get most recent feedback for display
  const recentFeedback = [...feedback]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{currentBrand?.name} Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Monitor feedback and gain insights to improve your business
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-primary hover:bg-primary/90">
                Export Report
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex gap-2">
              <TabsTrigger value="overview" onClick={() => setSelectedTab('overview')}>Overview</TabsTrigger>
              <TabsTrigger value="feedback" onClick={() => setSelectedTab('feedback')}>Feedback</TabsTrigger>
              <TabsTrigger value="insights" onClick={() => setSelectedTab('insights')}>Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              {/* Stats Cards */}
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
                    <div className="text-3xl font-bold">${currentBrand?.storeCredit || 0}</div>
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
              
              {/* Charts */}
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
              
              {/* Recent Feedback Preview */}
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
            </TabsContent>
            
            <TabsContent value="feedback" className="space-y-8">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>All Feedback</CardTitle>
                  <CardDescription>
                    Complete feedback history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {feedback.length > 0 ? (
                    <div className="space-y-6">
                      {/* This would be paginated in a real app */}
                      {feedback.map(item => {
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
                    <div className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                      <p className="text-muted-foreground">No feedback received yet</p>
                      <Button className="mt-4" variant="outline">
                        Setup Feedback Collection
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-effect md:col-span-2">
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                    <CardDescription>
                      Important patterns identified in your feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/50 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Product Size Confusion</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                              Multiple customers mentioned that product dimensions were unclear or misleading on product pages.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/50 rounded-lg">
                        <div className="flex items-start">
                          <Award className="h-5 w-5 text-green-600 dark:text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-green-800 dark:text-green-400">Positive Product Quality</h4>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                              Despite returns, most customers praised the overall quality of the products.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/50 rounded-lg">
                        <div className="flex items-start">
                          <CircleHelp className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-blue-800 dark:text-blue-400">Feature Request Trend</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              Several customers mentioned wanting additional color options for popular products.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Common Topics</CardTitle>
                    <CardDescription>
                      Frequently mentioned topics in feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Product Size</span>
                          <span className="text-sm text-muted-foreground">48%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '48%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Product Description</span>
                          <span className="text-sm text-muted-foreground">35%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Shipping Time</span>
                          <span className="text-sm text-muted-foreground">29%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '29%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Color Options</span>
                          <span className="text-sm text-muted-foreground">18%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Price Concerns</span>
                          <span className="text-sm text-muted-foreground">12%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrandDashboard;
