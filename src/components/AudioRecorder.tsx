
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Trash2, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => void;
}

const AudioRecorder = ({ onAudioRecorded }: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformAmplitude, setWaveformAmplitude] = useState<number[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize audio context
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context and analyser for visualizations
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      source.connect(analyserRef.current);
      
      // Set up recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onAudioRecorded(audioBlob);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Initialize waveform
      setWaveformAmplitude(Array(20).fill(0));
      
      // Start recording
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Start visualization
      visualizeAudio();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record feedback.",
        variant: "destructive",
      });
    }
  };
  
  const visualizeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    const updateWaveform = () => {
      analyserRef.current!.getByteFrequencyData(dataArrayRef.current!);
      
      // Get samples from frequency data to create waveform
      const samples = Array.from({length: 20}, (_, i) => {
        const index = Math.floor(i * dataArrayRef.current!.length / 20);
        return dataArrayRef.current![index] / 255; // Normalize to 0-1
      });
      
      setWaveformAmplitude(samples);
      
      if (recording) {
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      }
    };
    
    updateWaveform();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioURL) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      audioChunksRef.current = [];
      setRecordingDuration(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle audio element events
  useEffect(() => {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      
      const handleEnded = () => setIsPlaying(false);
      const handlePause = () => setIsPlaying(false);
      
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('pause', handlePause);
      
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('pause', handlePause);
      };
    }
  }, [audioURL]);

  return (
    <div className="glass-effect rounded-xl p-6 w-full max-w-md mx-auto animate-fade-in">
      {audioURL ? (
        <audio ref={audioRef} src={audioURL} className="hidden" />
      ) : null}
      
      <div className="flex flex-col items-center space-y-6">
        {/* Recording interface or waveform visualization */}
        <div className="h-24 w-full flex items-center justify-center">
          {recording ? (
            <div className="flex items-end justify-center space-x-1 h-full w-full">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="waveform-bar"
                  style={{
                    height: `${(waveformAmplitude[i] || 0.05) * 100}%`,
                    '--i': i,
                    '--speed': `${0.5 + Math.random() * 0.5}s`
                  } as React.CSSProperties}
                />
              ))}
            </div>
          ) : audioURL ? (
            <div className="text-center">
              <div className="text-2xl font-medium mb-2">Recording Complete</div>
              <div className="text-muted-foreground">Duration: {formatTime(recordingDuration)}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Mic className="h-12 w-12 text-primary mb-2" />
              <p className="text-center text-muted-foreground">
                Click the record button to start sharing your feedback
              </p>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {recording ? (
            <Button 
              onClick={stopRecording} 
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg"
            >
              <Square className="h-6 w-6" />
            </Button>
          ) : audioURL ? (
            <>
              <Button
                onClick={deleteRecording}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-2"
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
              
              <Button
                onClick={playRecording}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-2"
                disabled={isPlaying}
              >
                <Play className="h-5 w-5" />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600"
              >
                <Check className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button 
              onClick={startRecording} 
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
              size="icon"
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}
        </div>
        
        {recording && (
          <div className="flex items-center space-x-2">
            <div className="recording-indicator" />
            <span className="text-sm font-medium">Recording: {formatTime(recordingDuration)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
