import supabase from '../../config/supabaseClient'; // Adjust path as needed

export const getUserSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      console.error('Failed to get session:', error || 'No session');
      return null;
    }

    console.log('Session found:');
    console.log('Token:', session.access_token);  // Log the token to ensure it's being retrieved
    console.log('User:', session.user);          // Log the user to ensure it's being retrieved

    return {
      user: session.user,
      token: session.access_token,
    };
  } catch (err) {
    console.error('Error during session retrieval:', err);
    return null;
  }
};