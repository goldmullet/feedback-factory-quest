
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, ClipboardCopy, UserCircle, Mail, Gift } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShareSurveyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surveyLink: string;
}

const SurveyShare = ({ open, onOpenChange, surveyLink }: ShareSurveyProps) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(surveyLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast({
      title: "Link copied",
      description: "Survey link copied to clipboard"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Survey</DialogTitle>
          <DialogDescription>
            Copy the link below to share this survey with your customers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-2 mt-4">
          <Input value={surveyLink} readOnly className="flex-1" />
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            {linkCopied ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardCopy className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-medium">What happens when someone opens this link?</h3>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                <ClipboardCopy className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                They'll see your survey introduction and questions
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                <UserCircle className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                They'll provide their name and email for identification
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                They'll submit feedback to your questions
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
                <Gift className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                They'll earn store credit for completing the survey
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyShare;
