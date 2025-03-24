
import { useEffect } from 'react';

// Add audioBlobs to the global Window interface
declare global {
  interface Window {
    audioBlobs?: {[key: string]: Blob};
  }
}

/**
 * Component to initialize global audioBlobs
 * This ensures the window.audioBlobs is properly initialized
 */
const AudioBlobsInitializer = () => {
  useEffect(() => {
    // Initialize global audioBlobs
    window.audioBlobs = {};
  }, []);
  
  return null; // This component doesn't render anything
};

export default AudioBlobsInitializer;
