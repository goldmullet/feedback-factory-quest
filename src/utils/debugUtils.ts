
/**
 * Debug logging utility that only logs in development environment
 */
export const debugLog = (...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

/**
 * Error logging utility that only logs in development environment
 */
export const debugError = (...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};
