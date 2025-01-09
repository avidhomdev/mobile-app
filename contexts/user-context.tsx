import { supabase } from "@/lib/supabase";
import { Tables } from "@/supabase";
import { useGlobalSearchParams } from "expo-router";
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

interface ILocationProfile extends Tables<"business_location_profiles"> {
  profile: Tables<"profiles">;
}

interface ILocationCustomer extends Tables<"business_location_customers"> {
  appointments: Tables<"business_appointments">[];
}

interface ILocation extends Partial<Tables<"business_locations">> {
  jobs: Tables<"business_location_jobs">[];
  customers: ILocationCustomer[];
  profiles: ILocationProfile[];
}

type TUserContextProps = {
  closers: Tables<"profiles">[] | null;
  customer: ILocationCustomer | null;
  jobs: Tables<"business_location_jobs">[];
  locations: ILocation[];
  profile: IProfile;
  refreshData: () => void | Promise<void>;
  location: ILocation & Partial<Tables<"business_location_profiles">>;
};

const defaultContext = {
  closers: null,
  customer: null,
  jobs: [],
  location: { jobs: [], customers: [], profiles: [] },
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
        "*, customers: business_location_customers(*, appointments: business_appointments(*)), jobs: business_location_jobs(*), profiles: business_location_profiles(*, profile: profile_id(*))"
      ),
  ]);

  return {
    closers: null,
    customer: null,
    jobs: [],
    location: locations ? locations[0] : { jobs: [], customers: [] },
    locations: locations ?? [],
    profile: profile ?? {},
  };
};

export function UserProvider({
  children,
  session,
}: PropsWithChildren<{ session: string }>) {
  const params = useGlobalSearchParams();
  const [data, setData] =
    useState<Omit<TUserContextProps, "refreshData">>(defaultContext);

  const refreshData = useCallback(
    async () => fetchUserContextData(session).then(setData),
    [session]
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const customer =
    params.customerId &&
    data.location &&
    data.location.customers.find((c) => c.id === Number(params.customerId));

  const closers = data.location?.profiles.flatMap((profile) =>
    profile.is_closer ? profile.profile : []
  );

  const value = useMemo(
    () => ({
      ...data,
      closers: closers || null,
      customer: customer || null,
      refreshData,
    }),
    [closers, customer, data, refreshData]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
