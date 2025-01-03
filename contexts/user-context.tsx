import { supabase } from "@/lib/supabase";
import { Tables } from "@/supabase";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface IProfile extends Omit<Tables<"profiles">, "created_at" | "id"> {
  created_at?: string;
  id?: string;
  location_profiles: Tables<"business_location_profiles">[];
}

interface ILocation extends Partial<Tables<"business_locations">> {
  jobs: Tables<"business_location_jobs">[];
  customers: Tables<"business_location_customers">[];
}

type TUserContextProps = {
  locations: ILocation[];
  profile: IProfile;
  refreshData: () => void | Promise<void>;
  location: ILocation & Partial<Tables<"business_location_profiles">>;
};

const defaultContext = {
  location: { jobs: [], customers: [] },
  locations: [],
  profile: {
    avatar_url: null,
    full_name: null,
    location_profiles: [],
    updated_at: null,
    username: null,
    website: null,
  },
};

const UserContext = React.createContext<TUserContextProps>({
  ...defaultContext,
  refreshData: () => {},
});

export function useUserContext() {
  const value = React.useContext(UserContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useUserContext must be wrapped in a <UserProvider />");
    }
  }
  return value;
}

const fetchUserContextData = async (
  id: string
): Promise<Omit<TUserContextProps, "refreshData">> => {
  const [{ data: profile }, { data: locations }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, location_profiles: business_location_profiles!profile_id(*)")
      .eq("id", id)
      .limit(1)
      .single(),
    supabase
      .from("business_locations")
      .select(
        "*, customers: business_location_customers(*), jobs: business_location_jobs(*)"
      ),
  ]);

  return {
    location: locations ? locations[0] : { jobs: [], customers: [] },
    locations: locations ?? [],
    profile: profile ?? {},
  };
};

export function UserProvider({
  children,
  session,
}: PropsWithChildren<{ session: string }>) {
  const [data, setData] =
    useState<Omit<TUserContextProps, "refreshData">>(defaultContext);

  const refreshData = useCallback(
    async () => fetchUserContextData(session).then(setData),
    [session]
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const value = useMemo(
    () => ({
      ...data,
      refreshData,
    }),
    [data, refreshData]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
