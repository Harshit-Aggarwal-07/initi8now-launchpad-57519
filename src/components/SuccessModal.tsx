import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}
export const SuccessModal = ({
  open,
  onClose
}: SuccessModalProps) => {
  return <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">You're On The List!</DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-4">
            <p className="text-base">
              Welcome to Initi8now! We've sent a confirmation email to your inbox.
            </p>
            <p className="text-sm text-muted-foreground">Thank you for contacting, We will get back to you soon. Get ready to have your work done" </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} className="bg-golden-cta hover:bg-primary text-foreground rounded-2xl px-8">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};