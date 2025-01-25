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
import { LocationProvider } from "./location-context";
import { DISPOSITION_STATUS_KEYS } from "@/constants/disposition_statuses";

interface IProfile extends Omit<Tables<"profiles">, "created_at" | "id"> {
  created_at?: string;
  id: string;
  location_profiles: Tables<"business_location_profiles">[];
}

export interface ILocationProfile extends Tables<"business_location_profiles"> {
  profile: Tables<"profiles">;
}

export interface ILocationCustomer
  extends Tables<"business_location_customers"> {
  disposition_status: DISPOSITION_STATUS_KEYS;
  appointments: Tables<"business_appointments">[];
  closer?: Tables<"profiles">;
}

export interface ILocation extends Partial<Tables<"business_locations">> {
  appointments: Tables<"business_appointments">[];
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
  location: { appointments: [], jobs: [], customers: [], profiles: [] },
  locations: [],
  profile: {
    avatar_url: null,
    full_name: null,
    location_profiles: [],
    updated_at: null,
    username: null,
    website: null,
    id: "",
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
      .select(
        "*, location_profiles: business_location_profiles!profile_id(*, location: location_id(*, customers: business_location_customers(*,  appointments: business_appointments(*)), jobs: business_location_jobs(*), profiles: business_location_profiles(*, profile: profile_id(*))))"
      )
      .eq("id", id)
      .limit(1)
      .single(),
    supabase
      .from("business_locations")
      .select(
        "*, appointments: business_appointments(*), customers: business_location_customers(*, closer: closer_id(*), appointments: business_appointments(*)), jobs: business_location_jobs(*), profiles: business_location_profiles(*, profile: profile_id(*))"
      ),
  ]);

  return {
    closers: null,
    customer: null,
    jobs: [],
    location: locations ? locations[0] : { jobs: [], customers: [] },
    locations: locations ?? [],
    profile,
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

  return (
    <UserContext.Provider value={value}>
      <LocationProvider
        key={data.profile.id}
        locations={data.locations}
        profile_id={data.profile.id}
      >
        {children}
      </LocationProvider>
    </UserContext.Provider>
  );
}
