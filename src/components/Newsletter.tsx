import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2 } from "lucide-react";
import { analytics } from "@/lib/analytics";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get UTM parameters and tracking data
      const urlParams = new URLSearchParams(window.location.search);
      const trackingData = {
        utm_source: urlParams.get("utm_source"),
        utm_medium: urlParams.get("utm_medium"),
        utm_campaign: urlParams.get("utm_campaign"),
        referrer: document.referrer || null,
        landing_page: window.location.pathname,
      };

      // Insert into database
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([
          {
            email: email.toLowerCase().trim(),
            ...trackingData,
          },
        ]);

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - email already exists
          toast({
            title: "Already Subscribed!",
            description: "This email is already on our newsletter list.",
          });
        } else {
          throw error;
        }
      } else {
        // Track newsletter signup
        analytics.trackNewsletterSignup();

        toast({
          title: "Successfully Subscribed!",
          description: "You'll receive our latest updates and announcements.",
        });
        setEmail("");
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-primary/5">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card rounded-3xl border border-border p-8 md:p-12 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Stay Updated with Initi8now
              </h2>
              <p className="text-muted-foreground">
                Get the latest updates on student opportunities, career tips, and platform news delivered to your inbox.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 text-base"
                disabled={isSubmitting}
                required
              />
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center sm:text-left">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
