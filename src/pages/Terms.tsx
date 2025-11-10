import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { CONTACT_EMAIL } from "@/lib/constants";

const Terms = () => {
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
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: January 2025</p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
            <p>By joining the Initi8now waitlist, you agree to these Terms & Conditions. Please read them carefully before submitting your information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Waitlist Registration</h2>
            <p>Joining the waitlist does not guarantee:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Immediate platform access</li>
              <li>Specific launch dates</li>
              <li>Job placement or employment</li>
            </ul>
            <p>Waitlist members will receive priority access notifications when the platform launches.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Accuracy of Information</h2>
            <p>You agree to provide accurate, current, and complete information. False or misleading information may result in removal from the waitlist.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Communications</h2>
            <p>By joining, you consent to receive:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Launch announcements and updates</li>
              <li>Early access invitations</li>
              <li>Platform feature notifications</li>
            </ul>
            <p>You may opt-out of communications at any time.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
            <p>All content, logos, and materials on Initi8now are protected by intellectual property rights owned by Initi8now.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
            <p>Initi8now is not liable for any indirect, incidental, or consequential damages arising from waitlist registration or platform use.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of updated terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
            <p>For questions about these terms, contact: <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a></p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;
