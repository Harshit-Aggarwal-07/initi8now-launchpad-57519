-- Add policy for users to view their own role
-- This is helpful for the frontend to check user permissions
CREATE POLICY "Users can view their own role only"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());