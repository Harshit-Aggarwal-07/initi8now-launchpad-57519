import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { CONTACT_EMAIL } from "@/lib/constants";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoLight} alt="Initi8now" className="h-8 dark:hidden" />
            <img src={logoDark} alt="Initi8now" className="h-8 hidden dark:block" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium text-primary hover:underline flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: January 2025</p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
            <p>Initi8now ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you join our waitlist.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p>When you join our waitlist, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact information (name, email, phone number)</li>
              <li>Educational details (college/university)</li>
              <li>Professional information (current role, areas of interest)</li>
              <li>Optional portfolio links (LinkedIn, GitHub, etc.)</li>
              <li>Usage data (UTM parameters, referrer information)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Notify you about platform launch and early access</li>
              <li>Match you with relevant opportunities</li>
              <li>Send updates about Initi8now features and services</li>
              <li>Improve our platform and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. Your data is stored securely and encrypted.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Opt-out of communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>For privacy-related questions, contact us at: <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a></p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
