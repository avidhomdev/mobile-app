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
import { DISPOSITION_STATUS_KEYS } from "@/constants/disposition-statuses";

export interface IProfile
  extends Omit<Tables<"profiles">, "created_at" | "id"> {
  created_at?: string;
  id: string;
  location_profiles: Tables<"business_location_profiles">[];
}

export interface ILocationProfile extends Tables<"business_location_profiles"> {
  profile: Tables<"profiles">;
}

export interface ILocationCustomerBidProduct
  extends Tables<"business_location_customer_bid_products"> {
  product: Tables<"business_products">;
}

export interface ILocationCustomerBid
  extends Tables<"business_location_customer_bids"> {
  media: Tables<"business_location_customer_bid_media">[];
  products: ILocationCustomerBidProduct[];
}

interface IJobProduct extends Tables<"business_location_job_products"> {
  product: Tables<"business_products">;
  quantity: number;
  price: number;
  total: number;
}

interface ILocationJobMessage extends Tables<"business_location_job_messages"> {
  profile: Tables<"profiles">;
}

interface ILocationJobTask extends Tables<"business_location_job_tasks"> {
  profile: Tables<"profiles">;
}
export interface ILocationJob extends Tables<"business_location_jobs"> {
  media: Tables<"business_location_job_media">[];
  messages: ILocationJobMessage[];
  products: IJobProduct[];
  tasks: ILocationJobTask[];
}
export interface ILocationCustomer
  extends Tables<"business_location_customers"> {
  appointments: Tables<"business_appointments">[];
  bids: ILocationCustomerBid[];
  closer?: Tables<"profiles">;
  disposition_status: DISPOSITION_STATUS_KEYS;
  jobs: ILocationJob[];
}

export interface IAppointments extends Tables<"business_appointments"> {
  profiles: Tables<"business_appointment_profiles">[];
}
export interface ILocation extends Partial<Tables<"business_locations">> {
  appointments: IAppointments[];
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
    address: "",
    address2: "",
    city: "",
    state: "",
    postal_code: "",
    email: "",
    phone: "",
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
    supabase.from("business_locations").select(`*,
        appointments:business_appointments(
          *,
          profiles: business_appointment_profiles(*),
          customer: customer_id(*)
        ),
        customers: business_location_customers(
          *,
          appointments: business_appointments(*),
          bids: business_location_customer_bids(
            *,
            media: business_location_customer_bid_media(*),
            products: business_location_customer_bid_products(
              *,
              product: product_id(*)
            )
          ),
          jobs: business_location_jobs(*,
            bid: bid_id(*,
              products: business_location_customer_bid_products(
                *,
                product: product_id(*)
              )
            ),
            media: business_location_job_media(*),
            messages: business_location_job_messages(*,
              profile: author_id(*)
            ),
            products: business_location_job_products(
              *,
              product: product_id(*)
            ),
            tasks: business_location_job_tasks(
              *,
              profile: completed_by_profile_id(*)
            )
          )
        ),
        jobs: business_location_jobs(*),
        profiles: business_location_profiles(
          *,
          profile: profile_id(*)
        )
      `),
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

  const refreshData = useCallback(async () => {
    return fetchUserContextData(session).then(setData);
  }, [session]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const customer =
    params.customerId &&
    data.location &&
    data.location.customers.find((c) => c.id === Number(params.customerId));

  const closers = data.location?.profiles.flatMap((profile) =>
    profile.is_closer
      ? { ...profile.profile, closer_priority: profile.closer_priority }
      : []
  );

  const value = useMemo(
    () => ({
      ...data,
      closers:
        closers?.sort((a, b) => a.closer_priority - b.closer_priority) || null,
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
