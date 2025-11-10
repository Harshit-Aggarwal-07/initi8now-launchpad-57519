# Admin Setup Guide

## Creating Your First Admin User

Since your database requires admin authentication to view waitlist data, you need to create your first admin user. Follow these steps:

### Step 1: Create an Account
1. Go to `/auth` on your deployed site
2. Click "Create Account"
3. Enter your details and create an account
4. You'll be automatically logged in

### Step 2: Make Yourself an Admin

You need to manually add your user to the `user_roles` table with admin privileges.

**Option 1: Using Lovable Cloud Backend UI**
1. Click on the "Cloud" tab in Lovable
2. Go to Database → Tables → user_roles
3. Click "Insert" and add a new row:
   - `user_id`: Your user ID (get this from the `auth.users` table or profiles table)
   - `role`: Select "admin"

**Option 2: Using SQL (in backend SQL editor)**
```sql
-- First, get your user_id from the profiles table
SELECT user_id, email FROM profiles WHERE email = 'your-email@example.com';

-- Then insert the admin role
INSERT INTO user_roles (user_id, role) 
VALUES ('your-user-id-here', 'admin');
```

### Step 3: Access Admin Dashboard
1. Go to `/admin` 
2. You should now see the full admin dashboard with all waitlist data
3. You can export data as CSV files

## Managing Additional Admins

To add more admin users:
1. They must first create an account at `/auth`
2. Then you (as an existing admin) need to add their user_id to the `user_roles` table with `role = 'admin'`

## Security Notes

✅ **Security measures in place:**
- SQL injection prevented via Zod validation
- Admin roles stored in separate table (not in profiles)
- Row-Level Security (RLS) policies enforce access control
- Only admins can add/modify admin roles
- Email uniqueness constraints prevent duplicates
- All user inputs are validated and sanitized

✅ **Email auto-confirmation is enabled** for faster testing during development.

⚠️ **Before production launch**, consider:
- Disabling auto-confirm email if you want email verification
- Setting up proper email verification flow
- Adding additional security measures as needed
