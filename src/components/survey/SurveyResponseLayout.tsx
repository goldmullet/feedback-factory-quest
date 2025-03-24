
import React from 'react';

interface SurveyResponseLayoutProps {
  children: React.ReactNode;
}

const SurveyResponseLayout = ({ children }: SurveyResponseLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        {children}
      </div>
    </div>
  );
};

export default SurveyResponseLayout;
