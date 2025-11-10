import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What are the best internship platforms for Indian students?",
    answer: "Initi8now is India's first verified part-time job and internship platform built specifically for students. Unlike general job boards that mix unverified listings, Initi8now offers 100% verified opportunities with AI-powered matching, skill badges, and dedicated support for Indian students across Delhi, Mumbai, Bangalore, and other cities."
  },
  {
    question: "What is Initi8now?",
    answer: "Initi8now is India's first verified part-time job and internship platform built for students. It connects youth with safe, scam-free opportunities, including internships, gigs, projects, and learning badges - all powered by AI matching and trusted employers."
  },
  {
    question: "Is joining the waitlist free?",
    answer: "Yes. Joining the waitlist is 100% free. You'll simply get early access before public launch, priority invites, and updates about openings that match your interests."
  },
  {
    question: "When will Initi8now launch?",
    answer: "The early access phase begins soon for waitlisted students and employers. Full public rollout will follow once the first batch of users and partners are onboarded. If you're on the waitlist, you'll be notified first."
  },
  {
    question: "What kind of opportunities will I find here?",
    answer: "You'll find verified internships, part-time jobs, projects, and campus-based gigs across multiple domains - from tech and marketing to design, sales, content, and operations. Every listing is screened for authenticity before it goes live."
  },
  {
    question: "How is Initi8now different from other job platforms?",
    answer: "Unlike traditional job boards, Initi8now is built exclusively for students and early talent. It offers: Verified and scam-free listings, AI-powered job matching, Skill badges and digital certificates, Mentorship and project collaboration tools, and Integrated wallet and progress tracking. You don't just apply for jobs - you grow your career ecosystem."
  },
  {
    question: "What happens after I sign up for the waitlist?",
    answer: "You'll receive a confirmation email and join our early community. As soon as the platform opens, you'll get first access to create your profile, explore verified jobs, and start earning badges. Early users also receive special rewards and community recognition."
  },
  {
    question: "Which cities and universities does Initi8now serve?",
    answer: "Initi8now serves students across India, including major cities like Delhi NCR, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Kolkata, and Ahmedabad. We work with students from IITs, NITs, Delhi University, Mumbai University, and hundreds of other colleges and universities nationwide."
  },
  {
    question: "What is AI-powered job matching?",
    answer: "Our AI analyzes your skills, interests, college, and preferences to recommend opportunities that best match your profile. Instead of scrolling through hundreds of irrelevant postings, you get personalized recommendations that actually fit your goals and availability."
  },
  {
    question: "How do you verify opportunities?",
    answer: "Every job, internship, and project on Initi8now is manually reviewed by our team. We verify the employer's identity, check company credentials, and ensure fair compensation and working conditions. This keeps scams, spam, and fake listings off the platform."
  },
  {
    question: "Can I use Initi8now while studying full-time?",
    answer: "Absolutely! Initi8now is designed for students who want flexible work options. You can filter opportunities by hours per week, remote/on-site preferences, and project duration. Whether you have 5 hours or 20 hours a week, you'll find suitable options."
  },
  {
    question: "How do I find verified part-time jobs as a student in India?",
    answer: "Initi8now solves this by manually verifying every opportunity before it goes live. Our team checks employer credentials, ensures fair compensation, and filters out scams. Plus, our AI matches jobs to your profile, so you only see relevant opportunities that fit your skills, location (Delhi, Mumbai, Bangalore, etc.), and availability."
  },
  {
    question: "Which platform has the best job matching for Indian college students?",
    answer: "Initi8now uses AI-powered job matching that analyzes your skills, college, interests, and career goals to recommend personalized opportunities. Unlike traditional job boards where you scroll through hundreds of irrelevant postings, our system shows you internships and part-time jobs that actually match your profile and preferences."
  },
  {
    question: "Are there campus internship platforms specifically for IIT, NIT, and top colleges?",
    answer: "Yes! Initi8now serves students from IITs, NITs, Delhi University, Mumbai University, and hundreds of colleges across India. Whether you're from a premier institution or any recognized college, you'll find verified internships, part-time work, and project opportunities tailored to your academic background and skills."
  },
  {
    question: "What makes Initi8now different from freelance marketplaces and general job portals?",
    answer: "Unlike freelance marketplaces (where anyone can post anything) or general job portals (designed for full-time corporate jobs), Initi8now is built exclusively for students. We focus on part-time, internship, and project-based work that fits your college schedule. Every listing is verified, employers are vetted, and our AI ensures you only see opportunities that match your student lifestyle."
  }
];

export const FAQ = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? faqs : faqs.slice(0, 6);

  return (
    <section className="py-16 px-4 bg-secondary/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {visibleFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card rounded-2xl border border-border px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {!showAll && faqs.length > 6 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              className="group"
            >
              Show More FAQs
              <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        )}
        
        {showAll && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setShowAll(false)}
              variant="outline"
            >
              Show Less
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
