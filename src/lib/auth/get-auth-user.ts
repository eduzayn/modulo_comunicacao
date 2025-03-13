import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';

// Mock user for testing purposes
const MOCK_USER = {
  id: '1',
  email: 'admin@edunexia.com',
  name: 'Administrador',
  role: 'admin',
};

/**
 * Get the authenticated user from the request
 * During testing, this returns a mock user
 */
export async function getAuthUser() {
  // For testing purposes, return a mock user
  return MOCK_USER;
  
  // In production, this would use Supabase auth
  /*
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // Get additional user data from the database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      name: profile.name,
      role: profile.role,
    };
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
  */
}

export default getAuthUser;
