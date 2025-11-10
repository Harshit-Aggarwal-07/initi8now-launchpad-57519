import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schema
const requestSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email().max(255),
  userType: z.enum(["student", "recruiter"]),
  company: z.string().max(200).optional(),
});

type WaitlistNotificationRequest = z.infer<typeof requestSchema>;

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input
    const validationResult = requestSchema.safeParse(rawData);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data",
          code: "VALIDATION_FAILED"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, userType, company } = validationResult.data;
    
    // Escape all user inputs for safe HTML embedding
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = company ? escapeHtml(company) : undefined;

    console.log(`Processing waitlist signup for ${userType}:`, { name: safeName, email: safeEmail, company: safeCompany });

    // Send confirmation email to the user using Resend API
    const userEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Initi8now <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Initi8now Waitlist! 🚀",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">
              Welcome to Initi8now, ${safeName}! 🎉
            </h1>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Thank you for joining India's Most Trusted Student Work Platform!
            </p>
            
            ${userType === "student" ? `
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                As a student member, you'll get early access to:
              </p>
              <ul style="color: #555; font-size: 16px; line-height: 1.8;">
                <li>100% verified internships and part-time opportunities</li>
                <li>AI-powered job matching tailored to your skills</li>
                <li>Skill badges and certifications</li>
                <li>Mentorship from industry professionals</li>
              </ul>
            ` : `
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                As a recruiter from ${safeCompany || "your organization"}, you'll get early access to:
              </p>
              <ul style="color: #555; font-size: 16px; line-height: 1.8;">
                <li>Connect with talented, verified Indian students</li>
                <li>AI-powered candidate matching</li>
                <li>Streamlined hiring process</li>
                <li>Access to diverse skill sets and fresh talent</li>
              </ul>
            `}
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-top: 30px;">
              We're working hard to launch soon. You'll be among the first to know when we go live!
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #888; font-size: 14px;">
                Best regards,<br>
                The Initi8now Team
              </p>
              <p style="color: #888; font-size: 12px; margin-top: 20px;">
                Empowering India's student workforce
              </p>
            </div>
          </div>
        `,
      }),
    });

    const userEmailData = await userEmailResponse.json();
    console.log("User confirmation email sent:", userEmailData);

    // Send notification to admin
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Initi8now Waitlist <onboarding@resend.dev>",
        to: ["initi8now@gmail.com"],
        subject: `New ${userType} joined the waitlist!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">New Waitlist Signup 🎯</h2>
            
            <p><strong>User Type:</strong> ${userType.toUpperCase()}</p>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ""}
            
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              Check your admin dashboard to view full details and reach out to this user.
            </p>
          </div>
        `,
      }),
    });

    const adminEmailData = await adminEmailResponse.json();
    console.log("Admin notification email sent:", adminEmailData);

    return new Response(
      JSON.stringify({ success: true, userEmail: userEmailData, adminEmail: adminEmailData }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-waitlist-notification function:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Return generic error message to client (no sensitive details)
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request. Please try again.",
        code: "NOTIFICATION_FAILED"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
