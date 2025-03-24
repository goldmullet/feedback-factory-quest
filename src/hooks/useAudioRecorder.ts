
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [waveformAmplitude, setWaveformAmplitude] = useState<number[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      audioChunksRef.current = [];
      setRecordingDuration(0);
    }
  };

  const getRecordingResult = (): Blob | null => {
    if (audioChunksRef.current.length > 0) {
      return new Blob(audioChunksRef.current, { type: 'audio/wav' });
    }
    return null;
  };

  return {
    recording,
    audioURL,
    recordingDuration,
    waveformAmplitude,
    startRecording,
    stopRecording,
    deleteRecording,
    getRecordingResult
  };
}
