import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { analytics } from "@/lib/analytics";

// Validation schemas
const studentSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  area_of_interest: z.string().min(1, "This field is required"),
  college: z.string().max(200).optional(),
  mobile_number: z.string().regex(/^[0-9+\-\s()]*$/, "Invalid phone number").max(20).optional().or(z.literal("")),
  student_role: z.string().max(100).optional(),
  preferred_industries: z.string().max(200).optional(),
  linkedin_url: z.string().url("Invalid URL").max(500).optional().or(z.literal("")),
  other_work_links: z.string().max(1000, "Work links must be less than 1000 characters").optional(),
});

const recruiterSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(200, "Company name must be less than 200 characters"),
  work_email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  contact_person_name: z.string().trim().min(1, "Contact person name is required").max(100, "Name must be less than 100 characters"),
  hiring_for: z.string().trim().min(1, "This field is required").max(200),
  hiring_interest: z.array(z.string()).min(1, "Select at least one option"),
  number_of_roles: z.string().max(50).optional(),
  requirement_details: z.string().max(500).optional(),
  universities_locations: z.string().max(300).optional(),
  contact_phone: z.string().regex(/^[0-9+\-\s()]*$/, "Invalid phone number").max(20).optional().or(z.literal("")),
  quick_note: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

type UserType = "student" | "recruiter";

interface WaitlistFormProps {
  userType: UserType;
  onSuccess: () => void;
}

export const WaitlistForm = ({ userType, onSuccess }: WaitlistFormProps) => {
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [hiringInterest, setHiringInterest] = useState<string[]>([]);
  const [formStarted, setFormStarted] = useState(false);
  const { toast } = useToast();

  // Track form start on first interaction
  const handleFormStart = () => {
    if (!formStarted) {
      analytics.trackFormStart(`waitlist_${userType}`);
      setFormStarted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Track form submit attempt
    analytics.trackFormSubmit(`waitlist_${userType}`);

    const formData = new FormData(e.currentTarget);
    const data: any = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Add hiring_interest array for recruiters
    if (userType === "recruiter") {
      data.hiring_interest = hiringInterest;
    }

    try {
      // Validate input based on user type
      const schema = userType === "student" ? studentSchema : recruiterSchema;
      const validatedData = schema.parse(data);

      // Add UTM and tracking data
      const urlParams = new URLSearchParams(window.location.search);
      let completeData: any = {
        ...validatedData,
        utm_source: urlParams.get("utm_source") || "",
        utm_medium: urlParams.get("utm_medium") || "",
        utm_campaign: urlParams.get("utm_campaign") || "",
        referrer: document.referrer || "",
        landing_page: window.location.href,
        user_type: userType,
      };

      // Convert hiring_interest array to comma-separated string for recruiters
      if (userType === "recruiter" && 'hiring_interest' in validatedData) {
        completeData.hiring_interest = Array.isArray(validatedData.hiring_interest) 
          ? validatedData.hiring_interest.join(', ') 
          : validatedData.hiring_interest;
      }

      const table = userType === "student" ? "students_waitlist" : "recruiters_waitlist";
      const { error } = await supabase.from(table).insert([completeData]);

      if (error) {
        // Check for duplicate email error
        if (error.code === '23505') {
          toast({
            title: "Email already registered",
            description: "This email is already on our waitlist. We'll keep you updated!",
            variant: "default",
          });
          setLoading(false);
          return;
        }
        throw error;
      }

      // Send notification email with validated data
      const emailData = userType === "student" 
        ? { name: data.full_name, email: data.email, userType: "student" as const }
        : { name: data.contact_person_name, email: data.work_email, userType: "recruiter" as const, company: data.company_name };

      await supabase.functions.invoke("send-waitlist-notification", {
        body: emailData,
      });

      onSuccess();
      toast({
        title: "Success!",
        description: "You've been added to the waitlist. Check your email for confirmation.",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const [showMore, setShowMore] = useState(false);

  if (userType === "student") {
    return (
      <form onSubmit={handleSubmit} className="space-y-4" onFocus={handleFormStart}>
        {/* Primary Fields */}
        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input id="full_name" name="full_name" required className="bg-card" />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required className="bg-card" />
        </div>

        <div>
          <Label htmlFor="area_of_interest">I'm Looking For *</Label>
          <Select name="area_of_interest" required>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Project">Project</SelectItem>
              <SelectItem value="Learning">Learning</SelectItem>
              <SelectItem value="Open to all">Open to all</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="college">College/University</Label>
          <Input id="college" name="college" className="bg-card" />
        </div>

        {/* Show More Toggle */}
        {!showMore && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowMore(true)}
            className="w-full text-primary hover:text-primary/80"
          >
            Show more fields (optional)
          </Button>
        )}

        {/* Additional Fields */}
        {showMore && (
          <div className="space-y-4 pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input id="mobile_number" name="mobile_number" type="tel" className="bg-card" />
              </div>
              <div>
                <Label htmlFor="student_role">Current Role</Label>
                <Input id="student_role" name="student_role" placeholder="e.g., Student, Fresher" className="bg-card" />
              </div>
            </div>

            <div>
              <Label htmlFor="preferred_industries">Preferred Industry/Domain</Label>
              <Input id="preferred_industries" name="preferred_industries" placeholder="e.g., Tech, Marketing, Design" className="bg-card" />
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
              <Input id="linkedin_url" name="linkedin_url" type="url" className="bg-card" />
            </div>

            <div>
              <Label htmlFor="other_work_links">Portfolio/Work Links</Label>
              <Textarea 
                id="other_work_links" 
                name="other_work_links" 
                placeholder="GitHub, Drive, Instagram, or any proof of work"
                className="bg-card"
              />
            </div>
          </div>
        )}

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="consent" 
            checked={consent} 
            onCheckedChange={(checked) => setConsent(checked as boolean)}
            required 
          />
          <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
            I agree to the Terms & Conditions and Privacy Policy. I consent to receive updates about Initi8now.
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-golden-cta hover:bg-primary text-foreground font-semibold rounded-2xl py-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          disabled={loading || !consent}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            "Join the Waitlist"
          )}
        </Button>
      </form>
    );
  }

  // Recruiter form
  return (
    <form onSubmit={handleSubmit} className="space-y-4" onFocus={handleFormStart}>
      {/* Primary Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company_name">Company Name / Individual *</Label>
          <Input id="company_name" name="company_name" required className="bg-card" />
        </div>
        <div>
          <Label htmlFor="work_email">Work Email *</Label>
          <Input id="work_email" name="work_email" type="email" required className="bg-card" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact_person_name">Contact Person Name *</Label>
          <Input id="contact_person_name" name="contact_person_name" required className="bg-card" />
        </div>
        <div>
          <Label htmlFor="hiring_for">Hiring For *</Label>
          <Input id="hiring_for" name="hiring_for" placeholder="e.g., Marketing Intern" required className="bg-card" />
        </div>
      </div>

      <div>
        <Label>Hiring Interest * (Select all that apply)</Label>
        <div className="space-y-2 mt-2">
          {["Internships", "Part-time", "Projects", "Gigs"].map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={hiringInterest.includes(option)}
                onCheckedChange={(checked) => {
                  setHiringInterest(prev => 
                    checked 
                      ? [...prev, option]
                      : prev.filter(item => item !== option)
                  );
                }}
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
        {hiringInterest.length === 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Select at least one option
          </p>
        )}
      </div>

      {/* Show More Toggle */}
      {!showMore && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowMore(true)}
          className="w-full text-primary hover:text-primary/80"
        >
          Show more fields (optional)
        </Button>
      )}

      {/* Additional Fields */}
      {showMore && (
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="number_of_roles">Number of Openings</Label>
            <Input id="number_of_roles" name="number_of_roles" placeholder="e.g., 5-10" className="bg-card" />
          </div>

          <div>
            <Label htmlFor="requirement_details">Requirement (Days & Hours)</Label>
            <Input id="requirement_details" name="requirement_details" placeholder="e.g., 3 days/week, 4 hours/day" className="bg-card" />
          </div>

          <div>
            <Label htmlFor="universities_locations">Preferred Universities/Locations</Label>
            <Input id="universities_locations" name="universities_locations" placeholder="e.g., Delhi NCR, IIT Delhi" className="bg-card" />
          </div>

          <div>
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input id="contact_phone" name="contact_phone" type="tel" className="bg-card" />
          </div>

          <div>
            <Label htmlFor="quick_note">Additional Notes</Label>
            <Textarea 
              id="quick_note" 
              name="quick_note" 
              placeholder="Anything else you'd like us to know?"
              className="bg-card"
            />
          </div>
        </div>
      )}

      <div className="flex items-start space-x-2">
        <Checkbox 
          id="consent" 
          checked={consent} 
          onCheckedChange={(checked) => setConsent(checked as boolean)}
          required 
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
          I agree to the Terms & Conditions and Privacy Policy. I consent to receive updates about Initi8now.
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-golden-cta hover:bg-primary text-foreground font-semibold rounded-2xl py-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
        disabled={loading || !consent || (userType === "recruiter" && hiringInterest.length === 0)}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Join as Recruiter"
        )}
      </Button>
    </form>
  );
};
