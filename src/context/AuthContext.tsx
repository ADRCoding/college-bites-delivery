
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type UserType = "parent" | "student" | "parent_driver" | "driver";

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
      
      // First try to sign in directly - this will work even if the email isn't confirmed
      const { data: userData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If there's an error about email not confirmed, we'll handle that specially
        if (signInError.message.includes("Email not confirmed")) {
          // Try to find user by email using auth.admin.listUsers() instead of getUserByEmail
          const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
          
          if (listError) throw listError;
          
          const foundUser = usersData?.users.find(u => u.email === email);
          
          if (foundUser) {
            // Set the user directly
            setUser(foundUser);
            toast.success("Login successful! Welcome back.");
            
            // Redirect based on stored user type
            const userType = foundUser.user_metadata?.userType;
            if (userType === 'driver') {
              navigate("/driver-dashboard");
            } else {
              navigate("/dashboard");
            }
            return;
          }
        } else {
          // For any other error, throw it
          throw signInError;
        }
      } else if (userData.user) {
        // Normal successful login
        toast.success("Login successful! Welcome back.");
        
        // Redirect based on user type
        const userType = userData.user.user_metadata?.userType;
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
      
      // Sign up the user without email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            userType,
          },
          // Disable email confirmation by not setting emailRedirectTo
        },
      });

      if (error) throw error;
      
      toast.success(`Account created successfully as a ${userType}!`);
      
      // Skip email confirmation and log the user in directly
      if (data.user) {
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
