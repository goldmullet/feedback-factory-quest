
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFeedback } from '@/context/feedback';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatsCards from '@/components/dashboard/StatsCards';
import FeedbackCharts from '@/components/dashboard/FeedbackCharts';
import RecentFeedback from '@/components/dashboard/RecentFeedback';
import AllFeedback from '@/components/dashboard/AllFeedback';
import KeyInsights from '@/components/dashboard/KeyInsights';
import SurveyList from '@/components/dashboard/SurveyList';
import SurveyCreation from '@/components/dashboard/SurveyCreation';
import SurveyShare from '@/components/dashboard/SurveyShare';
import { Survey } from '@/types';

const BrandDashboard = () => {
  const { feedback, questions, getCurrentBrand, addSurvey, surveys } = useFeedback();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showNewSurveyDialog, setShowNewSurveyDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [currentSurveyShare, setCurrentSurveyShare] = useState('');
  
  const currentBrand = getCurrentBrand();
  const totalFeedback = feedback.length;
  
  const handleCreateSurvey = (title: string, description: string, questions: {text: string, description: string}[]) => {
    const surveyId = addSurvey(currentBrand?.id || '', title, description, questions);
    setShowNewSurveyDialog(false);
  };

  const handleShareSurvey = (surveyId: string) => {
    // Generate a shareable link for the survey
    const shareableLink = `${window.location.origin}/survey/${surveyId}`;
    setCurrentSurveyShare(shareableLink);
    setShowShareDialog(true);
  };

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
            <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex gap-2">
              <TabsTrigger value="overview" onClick={() => setSelectedTab('overview')}>Overview</TabsTrigger>
              <TabsTrigger value="feedback" onClick={() => setSelectedTab('feedback')}>Feedback</TabsTrigger>
              <TabsTrigger value="insights" onClick={() => setSelectedTab('insights')}>Insights</TabsTrigger>
              <TabsTrigger value="surveys" onClick={() => setSelectedTab('surveys')}>Surveys</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              {/* Stats Cards */}
              <StatsCards totalFeedback={totalFeedback} storeCredit={currentBrand?.storeCredit || 0} />
              
              {/* Charts */}
              <FeedbackCharts />
              
              {/* Recent Feedback Preview */}
              <RecentFeedback feedback={feedback} questions={questions} />
            </TabsContent>
            
            <TabsContent value="feedback" className="space-y-8">
              <AllFeedback feedback={feedback} questions={questions} />
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-8">
              <KeyInsights />
            </TabsContent>

            <TabsContent value="surveys" className="space-y-8">
              <SurveyList 
                surveys={surveys} 
                brandId={currentBrand?.id || ''} 
                onCreateSurvey={() => setShowNewSurveyDialog(true)}
                onShareSurvey={handleShareSurvey}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />

      {/* Survey Dialogs */}
      <SurveyCreation 
        open={showNewSurveyDialog} 
        onOpenChange={setShowNewSurveyDialog} 
        onCreateSurvey={handleCreateSurvey} 
      />

      <SurveyShare 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog} 
        surveyLink={currentSurveyShare} 
      />
    </div>
  );
};

export default BrandDashboard;
