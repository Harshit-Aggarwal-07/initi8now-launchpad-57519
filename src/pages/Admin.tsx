import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, GraduationCap, Briefcase, Download } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import type { Session } from "@supabase/supabase-js";

interface Student {
  id: string;
  full_name: string;
  email: string;
  area_of_interest: string;
  college?: string;
  mobile_number?: string;
  created_at: string;
}

interface Recruiter {
  id: string;
  company_name: string;
  work_email: string;
  contact_person_name: string;
  hiring_for: string;
  hiring_interest: string;
  created_at: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [newsletter, setNewsletter] = useState<NewsletterSubscriber[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check auth and admin status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setSession(session);

      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      loadData();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load students
      const { data: studentsData, error: studentsError } = await supabase
        .from("students_waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Load recruiters
      const { data: recruitersData, error: recruitersError } = await supabase
        .from("recruiters_waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (recruitersError) throw recruitersError;
      setRecruiters(recruitersData || []);

      // Load newsletter subscribers
      const { data: newsletterData, error: newsletterError } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (newsletterError) throw newsletterError;
      setNewsletter(newsletterData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(",")
    );
    
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading || !session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src={logoLight} 
              alt="Initi8now Logo" 
              className="h-8 dark:hidden"
            />
            <img 
              src={logoDark} 
              alt="Initi8now Logo" 
              className="h-8 hidden dark:block"
            />
            <span className="text-sm font-medium text-muted-foreground ml-4">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button onClick={handleLogout} variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Waitlist Management</h1>
          <p className="text-muted-foreground">
            View and manage student and recruiter waitlist signups
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-primary">{students.length}</p>
              </div>
              <GraduationCap className="h-12 w-12 text-primary opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Recruiters</p>
                <p className="text-3xl font-bold text-primary">{recruiters.length}</p>
              </div>
              <Briefcase className="h-12 w-12 text-primary opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Newsletter Subscribers</p>
                <p className="text-3xl font-bold text-primary">{newsletter.length}</p>
              </div>
              <Download className="h-12 w-12 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
            <TabsTrigger value="students">
              <GraduationCap className="h-4 w-4 mr-2" />
              Students ({students.length})
            </TabsTrigger>
            <TabsTrigger value="recruiters">
              <Briefcase className="h-4 w-4 mr-2" />
              Recruiters ({recruiters.length})
            </TabsTrigger>
            <TabsTrigger value="newsletter">
              <Download className="h-4 w-4 mr-2" />
              Newsletter ({newsletter.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Student Waitlist</h2>
                <Button 
                  onClick={() => exportToCSV(students, "students-waitlist.csv")}
                  variant="outline"
                  disabled={students.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Looking For</th>
                      <th className="text-left py-3 px-4 font-semibold">College</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-3 px-4">{student.full_name}</td>
                        <td className="py-3 px-4">{student.email}</td>
                        <td className="py-3 px-4">{student.area_of_interest}</td>
                        <td className="py-3 px-4">{student.college || "—"}</td>
                        <td className="py-3 px-4">
                          {new Date(student.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {students.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No students in waitlist yet
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="recruiters">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recruiter Waitlist</h2>
                <Button 
                  onClick={() => exportToCSV(recruiters, "recruiters-waitlist.csv")}
                  variant="outline"
                  disabled={recruiters.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Company</th>
                      <th className="text-left py-3 px-4 font-semibold">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Hiring For</th>
                      <th className="text-left py-3 px-4 font-semibold">Interest</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recruiters.map((recruiter) => (
                      <tr key={recruiter.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-3 px-4">{recruiter.company_name}</td>
                        <td className="py-3 px-4">{recruiter.contact_person_name}</td>
                        <td className="py-3 px-4">{recruiter.work_email}</td>
                        <td className="py-3 px-4">{recruiter.hiring_for}</td>
                        <td className="py-3 px-4">{recruiter.hiring_interest}</td>
                        <td className="py-3 px-4">
                          {new Date(recruiter.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recruiters.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No recruiters in waitlist yet
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Newsletter Subscribers</h2>
                <Button 
                  onClick={() => exportToCSV(newsletter, "newsletter-subscribers.csv")}
                  variant="outline"
                  disabled={newsletter.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Subscribed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsletter.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-3 px-4">{subscriber.email}</td>
                        <td className="py-3 px-4">
                          {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {newsletter.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No newsletter subscribers yet
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
