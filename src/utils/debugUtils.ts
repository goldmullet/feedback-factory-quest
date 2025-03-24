
/**
 * Utility for debug logging - only active in development mode
 * 
 * @param message - The message to log
 * @param data - Optional data to log along with the message
 */
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    // Create timestamp for better debugging
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    if (data) {
      console.log(`[${timestamp}] ${message}`, data);
    } else {
      console.log(`[${timestamp}] ${message}`);
    }
  }
};

/**
 * Log an error with a consistent format - only active in development mode
 * 
 * @param message - Error message
 * @param error - Optional error object
 */
export const debugError = (message: string, error?: any) => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    if (error) {
      console.error(`[${timestamp}] ERROR: ${message}`, error);
    } else {
      console.error(`[${timestamp}] ERROR: ${message}`);
    }
  }
};

/**
 * Log a warning with a consistent format - only active in development mode
 * 
 * @param message - Warning message
 * @param data - Optional data
 */
export const debugWarn = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    if (data) {
      console.warn(`[${timestamp}] WARNING: ${message}`, data);
    } else {
      console.warn(`[${timestamp}] WARNING: ${message}`);
    }
  }
};
