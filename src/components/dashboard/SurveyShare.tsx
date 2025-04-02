
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, ClipboardCopy, UserCircle, Mail, Gift, AlertTriangle } from 'lucide-react';
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

  // Ensure the link is properly formatted with no encoding issues
  const safeLink = (() => {
    try {
      // Make sure we have a clean URL with no encoding issues
      const url = new URL(surveyLink);
      
      // Extract the survey ID from the path
      const pathParts = url.pathname.split('/');
      const surveyId = pathParts[pathParts.length - 1];
      
      // Reconstruct the URL with the clean survey ID
      url.pathname = `/survey/${surveyId}`;
      return url.toString();
    } catch (e) {
      console.error('Error formatting survey link:', e);
      return surveyLink;
    }
  })();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(safeLink);
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
          <Input value={safeLink} readOnly className="flex-1" />
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

        <div className="mt-4 text-sm p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">Troubleshooting Tips</p>
              <p className="text-xs mt-1 text-amber-700 dark:text-amber-400">
                If recipients have trouble opening the survey, ask them to:
              </p>
              <ul className="text-xs list-disc list-inside mt-1 text-amber-700 dark:text-amber-400">
                <li>Try a different browser</li>
                <li>Clear browser cache</li>
                <li>Ensure they're clicking the exact link (not typing it)</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyShare;
