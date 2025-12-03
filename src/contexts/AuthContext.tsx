import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  date_of_birth: string | null;
  avatar_url: string | null;
}

interface UserRole {
  role: 'admin' | 'lecturer' | 'student';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: 'admin' | 'lecturer' | 'student' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<'admin' | 'lecturer' | 'student' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer data fetching
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) throw roleError;
      setRole(roleData.role);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error('Lỗi khi tải thông tin người dùng');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success(`Chào mừng ${data.user.email}!`);
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Email hoặc mật khẩu không chính xác');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Try global sign out first, fallback to default
      let { error } = await supabase.auth.signOut({ scope: 'global' as any });
      if (error) {
        const fallback = await supabase.auth.signOut();
        error = fallback.error;
      }
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);

      toast.success('Đã đăng xuất thành công');
      navigate('/auth');
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Dù lỗi, vẫn dọn state để tránh kẹt phiên
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      navigate('/auth');
      toast.error(error.message || 'Lỗi khi đăng xuất');
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...data } : null);
      toast.success('Cập nhật thông tin thành công');
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error('Lỗi khi cập nhật thông tin');
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user?.email) {
        throw new Error('Không tìm thấy email người dùng');
      }

      // Re-authenticate with current password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (authError) throw authError;

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      toast.success('Đổi mật khẩu thành công');
    } catch (error: any) {
      console.error('Change password error:', error);
      toast.error('Lỗi khi đổi mật khẩu');
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    role,
    loading,
    signIn,
    signOut,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
