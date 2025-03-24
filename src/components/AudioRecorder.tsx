
import React, { useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import WaveformVisualizer from '@/components/audio/WaveformVisualizer';
import RecordingStatus from '@/components/audio/RecordingStatus';
import AudioControls from '@/components/audio/AudioControls';

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => void;
}

const AudioRecorder = ({ onAudioRecorded }: AudioRecorderProps) => {
  const {
    recording,
    audioURL,
    recordingDuration,
    waveformAmplitude,
    startRecording,
    stopRecording,
    deleteRecording,
    getRecordingResult
  } = useAudioRecorder();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle audio element events
  useEffect(() => {
    if (audioRef.current && audioURL) {
      const audioElement = audioRef.current;
      
      const handleEnded = () => {};
      const handlePause = () => {};
      
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('pause', handlePause);
      
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('pause', handlePause);
      };
    }
  }, [audioURL]);

  const handleStopRecording = () => {
    stopRecording();
    const blob = getRecordingResult();
    if (blob) {
      onAudioRecorded(blob);
    }
  };

  const handleConfirmRecording = () => {
    const blob = getRecordingResult();
    if (blob) {
      onAudioRecorded(blob);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-effect rounded-xl p-6 w-full max-w-md mx-auto animate-fade-in">
      {audioURL ? (
        <audio ref={audioRef} src={audioURL} className="hidden" />
      ) : null}
      
      <div className="flex flex-col items-center space-y-6">
        {/* Recording interface or waveform visualization */}
        <div className="h-24 w-full flex items-center justify-center">
          {recording ? (
            <WaveformVisualizer amplitudes={waveformAmplitude} />
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
          <AudioControls
            recording={recording}
            audioURL={audioURL}
            onStartRecording={startRecording}
            onStopRecording={handleStopRecording}
            onDeleteRecording={deleteRecording}
            onConfirmRecording={handleConfirmRecording}
          />
        </div>
        
        <RecordingStatus isRecording={recording} duration={recordingDuration} />
      </div>
    </div>
  );
};

export default AudioRecorder;
