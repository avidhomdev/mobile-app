import { supabase } from "@/lib/supabase";
import { Tables } from "@/supabase";
import { useGlobalSearchParams } from "expo-router";
import React, { PropsWithChildren, useEffect, useState } from "react";

interface IJobProduct extends Tables<"business_location_job_products"> {
  product: Tables<"business_products">;
}

interface IJob extends Tables<"business_location_jobs"> {
  products: IJobProduct[];
}

type TJobContextProps = {
  job: IJob | null;
};

const defaultContext = {
  job: null,
};

const JobContext = React.createContext<TJobContextProps>(defaultContext);

export function useJobContext() {
  const value = React.useContext(JobContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useJobContext must be wrapped in a <JobProvider />");
    }
  }
  return value;
}

const fetchJobData = async (id: string): Promise<TJobContextProps> => {
  const [{ data: job }] = await Promise.all([
    supabase
      .from("business_location_jobs")
      .select(
        "*, products: business_location_job_products(*, product: business_products(*))"
      )
      .eq("id", id)
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    job,
  };
};

export function JobProvider({ children }: PropsWithChildren) {
  const { jobId } = useGlobalSearchParams();
  const [data, setData] = useState<TJobContextProps>(defaultContext);

  useEffect(() => {
    fetchJobData(jobId as string).then(setData);
  }, [jobId]);

  return <JobContext.Provider value={data}>{children}</JobContext.Provider>;
}
