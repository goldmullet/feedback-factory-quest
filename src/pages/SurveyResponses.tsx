
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeedback } from '@/context/feedback';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Play } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Survey, SurveyResponse } from '@/types';

const SurveyResponses = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { surveys, surveyResponses } = useFeedback();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  
  useEffect(() => {
    if (surveyId) {
      const foundSurvey = surveys.find(s => s.id === surveyId);
      if (foundSurvey) {
        setSurvey(foundSurvey);
        
        const filteredResponses = surveyResponses.filter(r => r.surveyId === surveyId);
        setResponses(filteredResponses);
      }
    }
  }, [surveyId, surveys, surveyResponses]);
  
  const handleBackToDashboard = () => {
    navigate('/brand/dashboard');
  };
  
  const handleViewResponse = (response: SurveyResponse) => {
    setSelectedResponse(response);
  };
  
  const handlePlayAudio = (url: string, questionId: string) => {
    // Stop any currently playing audio
    if (audioPlaying) {
      const audioElement = document.getElementById("response-audio") as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
      }
    }
    
    // Play the new audio
    setCurrentAudio(url);
    setAudioPlaying(questionId);
    
    // Use setTimeout to give the audio element time to update its src
    setTimeout(() => {
      const audioElement = document.getElementById("response-audio") as HTMLAudioElement;
      if (audioElement) {
        audioElement.play()
          .then(() => {
            // Audio started playing
          })
          .catch(error => {
            console.error("Error playing audio:", error);
          });
          
        // Set up ended event to clear playing state
        audioElement.onended = () => {
          setAudioPlaying(null);
        };
      }
    }, 100);
  };
  
  const stopAudio = () => {
    const audioElement = document.getElementById("response-audio") as HTMLAudioElement;
    if (audioElement) {
      audioElement.pause();
      setAudioPlaying(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-custom">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={handleBackToDashboard} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Survey Responses</h1>
          </div>
          
          {/* Hidden audio element for playing response recordings */}
          <audio id="response-audio" className="hidden" controls>
            <source src={currentAudio || ''} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          
          {survey ? (
            <div className="space-y-8">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>{survey.title}</CardTitle>
                  <CardDescription>{survey.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Questions:</span> {survey.questions.length}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Responses:</span> {responses.length}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Created:</span> {survey.createdAt.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
              
              {responses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle>All Responses</CardTitle>
                        <CardDescription>Select a response to view details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {responses.map((response, index) => (
                            <div 
                              key={response.id}
                              className={`p-4 rounded-lg cursor-pointer border transition-colors ${
                                selectedResponse?.id === response.id 
                                  ? 'bg-primary/10 border-primary' 
                                  : 'hover:bg-muted border-transparent'
                              }`}
                              onClick={() => handleViewResponse(response)}
                            >
                              <p className="font-medium">
                                Response #{index + 1}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {response.createdAt.toLocaleDateString()} at {response.createdAt.toLocaleTimeString()}
                              </p>
                              {response.respondent && (
                                <p className="text-sm mt-2">
                                  {response.respondent.name || 'Anonymous'} 
                                  {response.respondent.email && ` (${response.respondent.email})`}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-2">
                    {selectedResponse ? (
                      <Card className="glass-effect">
                        <CardHeader>
                          <CardTitle>Response Details</CardTitle>
                          <CardDescription>
                            Submitted on {selectedResponse.createdAt.toLocaleDateString()} at {selectedResponse.createdAt.toLocaleTimeString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Question</TableHead>
                                <TableHead>Answer</TableHead>
                                <TableHead>Audio</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedResponse.answers.map((answer) => {
                                // Find the question from the survey
                                const question = survey.questions.find(q => q.id === answer.questionId);
                                // Get the audio URL for this question if available
                                const audioUrl = selectedResponse.audioUrls?.[answer.questionId];
                                // Get the transcription if available
                                const transcription = selectedResponse.transcriptions?.[answer.questionId];
                                // Get insights if available
                                const insights = selectedResponse.insights?.[answer.questionId];
                                
                                return (
                                  <TableRow key={answer.questionId}>
                                    <TableCell className="font-medium">
                                      {question?.text || 'Unknown Question'}
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-2">
                                        {transcription ? (
                                          <>
                                            <p>{transcription}</p>
                                            {insights && insights.length > 0 && (
                                              <div className="pt-2">
                                                <p className="text-sm font-medium mb-1">Key Insights:</p>
                                                <div className="flex flex-wrap gap-2">
                                                  {insights.map((insight, idx) => (
                                                    <div key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                      {insight}
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <p>{answer.answer || 'No text response'}</p>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {audioUrl ? (
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => {
                                            if (audioPlaying === answer.questionId) {
                                              stopAudio();
                                            } else {
                                              handlePlayAudio(audioUrl, answer.questionId);
                                            }
                                          }}
                                        >
                                          {audioPlaying === answer.questionId ? (
                                            <>Stop</>
                                          ) : (
                                            <><Play className="h-4 w-4 mr-1" /> Play</>
                                          )}
                                        </Button>
                                      ) : (
                                        <span className="text-sm text-muted-foreground">No audio</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="glass-effect h-full flex flex-col items-center justify-center py-16">
                        <MessageSquare className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                        <p className="text-muted-foreground">Select a response to view details</p>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <Card className="glass-effect">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <MessageSquare className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                    <p className="text-muted-foreground">No responses received yet</p>
                    <Button className="mt-4" variant="outline" onClick={handleBackToDashboard}>
                      Back to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="glass-effect">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                <p className="text-muted-foreground">Survey not found</p>
                <Button className="mt-4" variant="outline" onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SurveyResponses;
