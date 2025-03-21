
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Question from '@/components/Question';
import AudioRecorder from '@/components/AudioRecorder';
import { useFeedback } from '@/context/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Check, Gift, ArrowRight, Loader2 } from 'lucide-react';

const ConsumerFeedback = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { questions, addFeedback } = useFeedback();
  
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rewardCode, setRewardCode] = useState<string | null>(null);
  
  useEffect(() => {
    if (questionId) {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        setCurrentQuestion(question);
      } else {
        // If question not found, use the first question
        setCurrentQuestion(questions[0]);
      }
    }
  }, [questionId, questions]);

  const handleAudioRecorded = (blob: Blob) => {
    setAudioBlob(blob);
  };

  const handleSubmit = () => {
    if (!audioBlob) {
      toast({
        title: "Missing Recording",
        description: "Please record your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Submit feedback
    addFeedback(currentQuestion.id, audioBlob);
    
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setRewardCode('FEEDBACK10');
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
      });
    }, 2000);
  };

  const handleNext = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Share Your Feedback</h1>
            <p className="text-muted-foreground mt-2">
              Your honest feedback helps improve products and services
            </p>
          </div>
          
          {isSubmitted ? (
            <Card className="glass-effect border-none animate-fade-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Thank You For Your Feedback!</CardTitle>
                <CardDescription>
                  We appreciate your time and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center my-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                    <Check className="h-8 w-8" />
                  </div>
                </div>
                
                <div className="bg-secondary/50 p-6 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Gift className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-medium">Your Reward</h3>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">$10 Store Credit</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Use this code at checkout:
                  </div>
                  <div className="bg-background font-mono text-xl p-3 rounded-md border border-border/50">
                    {rewardCode}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={handleNext} className="mt-4 px-8 bg-primary hover:bg-primary/90">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-8">
              <Question 
                question={currentQuestion?.text || "Why did you return this product?"} 
                description={currentQuestion?.description}
              />
              
              <AudioRecorder onAudioRecorded={handleAudioRecorded} />
              
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleSubmit}
                  disabled={!audioBlob || loading}
                  className="px-8 py-6 bg-primary hover:bg-primary/90 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConsumerFeedback;
