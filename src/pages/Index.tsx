import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CONTACT_EMAIL } from "@/lib/constants";
import { WaitlistForm } from "@/components/WaitlistForm";
import { SuccessModal } from "@/components/SuccessModal";
import { FAQ } from "@/components/FAQ";
import { HowItWorks } from "@/components/HowItWorks";
import { Newsletter } from "@/components/Newsletter";
import { analytics, trackPageView } from "@/lib/analytics";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { Briefcase, GraduationCap, Shield, Sparkles, TrendingUp, Users } from "lucide-react";

const Index = () => {
  const [userType, setUserType] = useState<"student" | "recruiter">("student");
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  // Handle user type toggle with analytics
  const handleUserTypeChange = (type: "student" | "recruiter") => {
    setUserType(type);
    analytics.trackUserTypeToggle(type);
  };

  // Handle waitlist success with analytics
  const handleWaitlistSuccess = () => {
    analytics.trackWaitlistSignup(userType);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src={logoLight} 
              alt="Initi8now Logo - India's Trusted Student Work Platform" 
              className="h-8 dark:hidden"
            />
            <img 
              src={logoDark} 
              alt="Initi8now Logo - India's Trusted Student Work Platform" 
              className="h-8 hidden dark:block"
            />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary animate-fade-in">
            🚀 India's First Verified Student Work Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Verified Internships & Part-time Jobs<br />
            Built for <span className="text-primary">Indian Students</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 10,000+ students across Delhi, Mumbai, Bangalore, and beyond. Get AI-powered job matching, skill badges, and 100% scam-free opportunities verified by our team.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-2 p-4 bg-card rounded-2xl border border-border">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">100% Verified</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-card rounded-2xl border border-border">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">AI Matching</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-card rounded-2xl border border-border">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Skill Badges</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-card rounded-2xl border border-border">
              <Users className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Mentorship</span>
            </div>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-2xl mx-auto bg-card rounded-3xl shadow-2xl p-8 border border-border">
            {/* Toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-muted rounded-2xl p-1">
                <button
                  onClick={() => handleUserTypeChange("student")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    userType === "student"
                      ? "bg-primary text-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GraduationCap className="inline-block mr-2 h-5 w-5" />
                  I'm a Student
                </button>
                <button
                  onClick={() => handleUserTypeChange("recruiter")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    userType === "recruiter"
                      ? "bg-primary text-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Briefcase className="inline-block mr-2 h-5 w-5" />
                  I'm a Recruiter
                </button>
              </div>
            </div>

            <WaitlistForm 
              userType={userType} 
              onSuccess={handleWaitlistSuccess}
            />
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Join Initi8now?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">100% Verified Opportunities</h3>
              <p className="text-muted-foreground">
                Every internship, part-time job, and project listing is thoroughly screened by our team. No scams, no fake jobs, no spam. Only trusted employers and genuine opportunities for Indian students.
              </p>
            </div>
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">AI-Powered Job Matching</h3>
              <p className="text-muted-foreground">
                Get personalized internship and part-time job recommendations based on your skills, college, interests, and career goals. Unlike general job boards, our AI shows you opportunities that actually fit your student profile. Find the perfect match faster.
              </p>
            </div>
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Grow Your Career</h3>
              <p className="text-muted-foreground">
                Earn skill badges, build your portfolio, and access mentorship. It's not just a job board—it's your career ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* How It Works Section */}
      <HowItWorks />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p className="mb-4">
            © 2025 Initi8now. Empowering India's student workforce.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link 
              to="/privacy" 
              className="hover:text-primary transition-colors"
              onClick={() => analytics.trackNavigation('privacy_policy')}
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="hover:text-primary transition-colors"
              onClick={() => analytics.trackNavigation('terms_conditions')}
            >
              Terms & Conditions
            </Link>
            <a 
              href={`mailto:${CONTACT_EMAIL}`} 
              className="hover:text-primary transition-colors"
              onClick={() => analytics.trackButtonClick('contact_us', 'footer')}
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
};

export default Index;
