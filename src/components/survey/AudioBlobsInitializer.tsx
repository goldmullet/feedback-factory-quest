
import { useEffect } from 'react';
import { debugLog } from '@/utils/debugUtils';

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
    debugLog('AudioBlobsInitializer: Initialized global audioBlobs');
    
    // Clean up function
    return () => {
      // Optionally clear audioBlobs on unmount
      // This could prevent memory leaks from large blobs
      if (window.audioBlobs) {
        const count = Object.keys(window.audioBlobs).length;
        if (count > 0) {
          debugLog(`AudioBlobsInitializer: Cleaning up ${count} audio blobs`);
        }
        window.audioBlobs = {};
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default AudioBlobsInitializer;
