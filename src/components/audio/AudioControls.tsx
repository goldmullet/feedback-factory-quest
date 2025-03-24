
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Trash2, Check } from 'lucide-react';

interface AudioControlsProps {
  recording: boolean;
  audioURL: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onDeleteRecording: () => void;
  onConfirmRecording: () => void;
}

const AudioControls = ({
  recording,
  audioURL,
  onStartRecording,
  onStopRecording,
  onDeleteRecording,
  onConfirmRecording
}: AudioControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playRecording = () => {
    const audio = new Audio(audioURL || '');
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.play();
    setIsPlaying(true);
  };

  if (recording) {
    return (
      <Button 
        onClick={onStopRecording} 
        variant="destructive"
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
      >
        <Square className="h-6 w-6" />
      </Button>
    );
  }

  if (audioURL) {
    return (
      <>
        <Button
          onClick={onDeleteRecording}
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
          onClick={onConfirmRecording}
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600"
        >
          <Check className="h-5 w-5" />
        </Button>
      </>
    );
  }

  return (
    <Button 
      onClick={onStartRecording} 
      className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
      size="icon"
    >
      <Mic className="h-6 w-6" />
    </Button>
  );
};

export default AudioControls;
