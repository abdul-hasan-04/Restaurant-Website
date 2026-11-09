import supabase from "../lib/supabase"

export const signUpAuth = async (email, password, fullName = "") => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } }, });
    if (error) {
        throw error
    }
    return { data, error }
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;

  return data;
}

export const siginIn = async (email, password) => {
    const {data, error} = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        throw error;
    }
    return {data, error}
}

export const onAuthChange = callback => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null, event)
    })

    return () => data.subscription.unsubscribe();
}

export const getUserProfile = async id => {
    const { data, error } = await supabase.
        from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (error) {
        throw error
    }


    return { data, error }
}

