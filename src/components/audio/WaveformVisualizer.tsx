
import React from 'react';

interface WaveformVisualizerProps {
  amplitudes: number[];
}

const WaveformVisualizer = ({ amplitudes }: WaveformVisualizerProps) => {
  return (
    <div className="flex items-end justify-center space-x-1 h-full w-full">
      {Array.from({ length: amplitudes.length }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: `${(amplitudes[i] || 0.05) * 100}%`,
            '--i': i,
            '--speed': `${0.5 + Math.random() * 0.5}s`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default WaveformVisualizer;
