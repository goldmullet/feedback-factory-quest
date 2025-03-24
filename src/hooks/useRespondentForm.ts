
import { useState } from 'react';

export interface RespondentInfo {
  name: string;
  email: string;
}

export interface RespondentFormErrors {
  [key: string]: string;
}

export function useRespondentForm(onStepChange: () => void) {
  const [respondentInfo, setRespondentInfo] = useState<RespondentInfo>({
    name: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<RespondentFormErrors>({});

  const handleInfoSubmit = (info: RespondentInfo, errors: RespondentFormErrors) => {
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    onStepChange();
    
    return info; // Return the info so the parent component can use it
  };

  return {
    respondentInfo,
    setRespondentInfo,
    formErrors,
    handleInfoSubmit
  };
}
