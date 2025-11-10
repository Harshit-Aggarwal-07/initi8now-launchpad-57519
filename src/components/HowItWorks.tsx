import { UserPlus, Search, Briefcase, Award } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up & Create Profile",
    description: "Join the waitlist and get early access. Complete your profile with skills, interests, and availability.",
    color: "text-blue-500",
  },
  {
    icon: Search,
    title: "AI Matches Opportunities",
    description: "Our intelligent system analyzes your profile and recommends verified internships, jobs, and projects tailored to you.",
    color: "text-purple-500",
  },
  {
    icon: Briefcase,
    title: "Apply & Get Hired",
    description: "Apply directly through the platform. Connect with verified employers and start working on meaningful projects.",
    color: "text-green-500",
  },
  {
    icon: Award,
    title: "Earn & Build Your Portfolio",
    description: "Complete projects, earn skill badges, get certifications, and build a portfolio that stands out to future employers.",
    color: "text-orange-500",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Initi8now Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From signup to your first project—here's how we help Indian students find verified work opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                
                {/* Connector line (hidden on mobile, shown on desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-primary">
            Join the waitlist today and be among the first to experience the future of student work in India
          </p>
        </div>
      </div>
    </section>
  );
};