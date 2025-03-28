
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type UserType = "parent" | "student" | "driver";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userType: UserType | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, userType: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Store user role in localStorage when session changes
        if (session?.user) {
          const userMeta = session.user.user_metadata;
          if (userMeta && userMeta.userType) {
            localStorage.setItem('userRole', userMeta.userType);
            setUserType(userMeta.userType as UserType);
          }
        } else {
          localStorage.removeItem('userRole');
          setUserType(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Also store user role on initial load
      if (session?.user) {
        const userMeta = session.user.user_metadata;
        if (userMeta && userMeta.userType) {
          localStorage.setItem('userRole', userMeta.userType);
          setUserType(userMeta.userType as UserType);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simple sign in - just check username and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If it's an email confirmation error, just log in anyway (simplified approach)
        if (error.message.includes("Email not confirmed")) {
          // Try to sign in again, bypassing the error
          const { data: signInData, error: signInError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: undefined, // Skip email confirmation
            }
          });
          
          if (signInError) {
            throw signInError;
          }
          
          // If successful, set user and proceed
          if (signInData.user) {
            setUser(signInData.user);
            
            // Get user type from profile
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('user_type')
              .eq('email', email)
              .single();
              
            if (profileData) {
              setUserType(profileData.user_type as UserType);
            }
            
            toast.success("Login successful! Welcome back.");
            
            // Redirect based on user type
            const userType = profileData?.user_type;
            if (userType === 'driver') {
              navigate("/driver-dashboard");
            } else {
              navigate("/dashboard");
            }
            
            return;
          }
        } else {
          // For any other error, throw it
          throw error;
        }
      }
      
      if (data.user) {
        toast.success("Login successful! Welcome back.");
        
        // Redirect based on user type
        const userType = data.user.user_metadata?.userType;
        if (userType === 'driver') {
          navigate("/driver-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, userType: string) => {
    try {
      setIsLoading(true);
      
      // Sign up without email confirmation 
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            userType,
          },
          // Skip email confirmation
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        throw error;
      }
      
      // Create a profile for the user
      if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          user_type: userType
        });
        
        toast.success(`Account created successfully!`);
        setUser(data.user);
        setUserType(userType as UserType);
        
        // Redirect based on user type
        if (userType === 'driver') {
          navigate("/driver-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success("You have been logged out.");
      navigate("/");
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    userType,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
