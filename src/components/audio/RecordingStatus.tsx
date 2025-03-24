
import React from 'react';

interface RecordingStatusProps {
  isRecording: boolean;
  duration: number;
}

const RecordingStatus = ({ isRecording, duration }: RecordingStatusProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording) return null;

  return (
    <div className="flex items-center space-x-2">
      <div className="recording-indicator" />
      <span className="text-sm font-medium">Recording: {formatTime(duration)}</span>
    </div>
  );
};

export default RecordingStatus;
