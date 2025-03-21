
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useFeedback } from '@/context/FeedbackContext';
import { toast } from '@/components/ui/use-toast';
import { Plus, ArrowRight, Trash2, HelpCircle } from 'lucide-react';

const Setup = () => {
  const navigate = useNavigate();
  const { questions, addQuestion, getCurrentBrand } = useFeedback();
  const currentBrand = getCurrentBrand();

  const [newQuestion, setNewQuestion] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question before adding.",
        variant: "destructive",
      });
      return;
    }

    if (currentBrand) {
      addQuestion(currentBrand.id, newQuestion, newDescription);
      
      // Clear inputs
      setNewQuestion('');
      setNewDescription('');
      
      toast({
        title: "Question Added",
        description: "Your question has been added successfully.",
      });
    }
  };

  const handleFinish = () => {
    navigate('/brand/dashboard');
  };

  const brandQuestions = questions.filter(q => q.brandId === currentBrand?.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-custom max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Set Up Your Questions</h1>
            <p className="text-muted-foreground mt-2">
              Create questions to collect specific feedback from your customers
            </p>
          </div>
          
          <div className="space-y-8">
            <Card className="glass-effect border-none">
              <CardHeader>
                <CardTitle>Add a New Question</CardTitle>
                <CardDescription>
                  Create targeted questions for different feedback scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="e.g., Why did you return this product?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add additional context or instructions for the customer"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleAddQuestion}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="glass-effect border-none">
              <CardHeader>
                <CardTitle>Your Questions</CardTitle>
                <CardDescription>
                  Manage your feedback collection questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {brandQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {brandQuestions.map((question) => (
                      <div key={question.id} className="p-4 border rounded-lg bg-background/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{question.text}</h3>
                            {question.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {question.description}
                              </p>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 text-muted-foreground opacity-30 mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't added any questions yet</p>
                    <p className="text-sm text-muted-foreground">
                      Add questions above to start collecting feedback
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleFinish}
                  className="bg-primary hover:bg-primary/90"
                  disabled={brandQuestions.length === 0}
                >
                  Finish Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Setup;
