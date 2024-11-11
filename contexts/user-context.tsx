import { supabase } from "@/lib/supabase";
import { Tables } from "@/supabase";
import React, { PropsWithChildren, useEffect, useState } from "react";

interface IProfile extends Omit<Tables<"profiles">, "created_at" | "id"> {
  created_at?: string;
  id?: string;
}

type TUserContextProps = {
  businesses: Tables<"businesses">[];
  jobs: Tables<"business_location_jobs">[];
  locations: Tables<"business_locations">[];
  profile: IProfile;
};

const defaultContext = {
  businesses: [],
  jobs: [],
  locations: [],
  profile: {
    avatar_url: null,
    full_name: null,
    updated_at: null,
    username: null,
    website: null,
  },
};

const UserContext = React.createContext<TUserContextProps>(defaultContext);

export function useUserContext() {
  const value = React.useContext(UserContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useUserContext must be wrapped in a <UserProvider />");
    }
  }
  return value;
}

const fetchProfileData = async (id: string): Promise<TUserContextProps> => {
  const [
    { data: profile },
    { data: businesses },
    { data: locations },
    { data: jobs },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).limit(1).maybeSingle(),
    supabase.from("businesses").select("*"),
    supabase.from("business_locations").select("*"),
    supabase.from("business_location_jobs").select("*"),
  ]);

  return {
    profile,
    businesses: businesses || [],
    locations: locations || [],
    jobs: jobs || [],
  };
};

export function UserProvider({
  children,
  session,
}: PropsWithChildren<{ session: string }>) {
  const [data, setData] = useState<TUserContextProps>(defaultContext);

  useEffect(() => {
    fetchProfileData(session).then(setData);
  }, [session]);

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}
