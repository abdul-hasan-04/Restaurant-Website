import { createContext, useEffect, useRef, useState } from "react";
import { getUserProfile, onAuthChange } from "../services/authServices";
import { toast } from "react-toastify";
import supabase from "../lib/supabase";

export const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const loadedUser = useRef();
  useEffect(() => {
    const cleanup = onAuthChange((async (user, event) => {
      setUser(user);
      if (user) {
        if (loadedUser.current === user?.id) return;
        setIsLoading(true);
        try {
          const { data, error } = await getUserProfile(user?.id);
          if (error) throw error;
          setProfile(data);
          loadedUser.current = user?.id
        } catch (error) {
          toast.error("Failed to fetch user's profile")
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        loadedUser.current = "";
        setProfile(null);
      }
    }))

    return cleanup;
  }, [])


  const logout = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Failed to logout");
        throw error
      }
      toast.success("Logged out Successfully.", { position: "bottom-right" })
    } catch (error) {
      setProfile(null);
      toast.error(error.message || "Failed to fetch user's profile");
    } finally {
      setIsLoading(false)
    }
  }

  const values = {
    isLoading,
    user,
    profile,
    logout,
    isLoggedIn: Boolean(user)
  }

  return <AuthContext.Provider value={values}>
    {children}
  </AuthContext.Provider>
}


export default AuthProvider