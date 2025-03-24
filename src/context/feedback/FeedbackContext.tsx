
import { createContext } from 'react';
import { FeedbackContextType } from '@/types';

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export default FeedbackContext;
