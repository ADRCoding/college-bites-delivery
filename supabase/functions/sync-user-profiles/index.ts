
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handler = async (req: Request): Promise<Response> => {
  try {
    // Sync all users from auth.users to user_profiles
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }
    
    // Create user profiles for each user that doesn't already have one
    for (const user of users.users) {
      // Check if user profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (!existingProfile) {
        // Create new user profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            user_type: user.user_metadata?.userType || 'student'
          });
        
        if (insertError) {
          console.error(`Failed to create profile for user ${user.id}:`, insertError);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'User profiles synced successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error syncing user profiles:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
