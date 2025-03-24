
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SurveyRespondentFormProps {
  respondentInfo: {
    name: string;
    email: string;
  };
  setRespondentInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
  }>>;
  formErrors: {[key: string]: string};
  onSubmit: (info: {name: string, email: string}, errors: {[key: string]: string}) => void;
}

const SurveyRespondentForm = ({
  respondentInfo,
  setRespondentInfo,
  formErrors,
  onSubmit
}: SurveyRespondentFormProps) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const errors: {[key: string]: string} = {};
    
    if (!respondentInfo.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!respondentInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(respondentInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    onSubmit(respondentInfo, errors);
  };
  
  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>About You</CardTitle>
        <CardDescription>
          Please provide your details to continue with the survey. Your information helps us ensure your store credit is correctly assigned.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name" 
              value={respondentInfo.name}
              onChange={(e) => setRespondentInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
            />
            {formErrors.name && (
              <p className="text-sm text-destructive">{formErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              value={respondentInfo.email}
              onChange={(e) => setRespondentInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email address"
            />
            {formErrors.email && (
              <p className="text-sm text-destructive">{formErrors.email}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Continue to Survey</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SurveyRespondentForm;
