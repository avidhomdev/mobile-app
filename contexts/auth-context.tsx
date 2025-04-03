import { useStorageState } from "@/hooks/useStorageState";
import { supabase } from "@/lib/supabase";
import { AuthTokenResponsePassword } from "@supabase/supabase-js";
import React, { useEffect } from "react";

type TSignIn = (args: {
  email: string;
  password: string;
}) => Promise<AuthTokenResponsePassword>;

const AuthContext = React.createContext<{
  signIn: undefined | TSignIn;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: undefined,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session?.user.id || null);
    });

    supabase.auth.onAuthStateChange((_, s) => {
      setSession(s?.user.id || null);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async ({ email, password }) =>
          supabase.auth.signInWithPassword({ email, password }),
        signOut: async () => {
          setSession(null);
          supabase.auth.signOut();
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
