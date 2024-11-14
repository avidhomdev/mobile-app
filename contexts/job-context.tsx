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

interface IJobProduct extends Tables<"business_location_job_products"> {
  product: Tables<"business_products">;
}

interface IJobMessage extends Tables<"business_location_job_messages"> {
  author: Tables<"profiles">;
}

interface IJob extends Tables<"business_location_jobs"> {
  products: IJobProduct[];
  notes: IJobMessage[];
}

type TJobContextProps = {
  job: IJob | null;
  refreshData: () => void;
};

const defaultContext = {
  job: null,
  refreshData: () => null,
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

const fetchJobData = async (id: string): Promise<IJob> => {
  const [{ data: job }] = await Promise.all([
    supabase
      .from("business_location_jobs")
      .select(
        "*, products: business_location_job_products(*, product: business_products(*)),notes: business_location_job_messages(*, author: author_id(*)) "
      )
      .eq("id", id)
      .limit(1)
      .maybeSingle(),
  ]);

  return job;
};

export function JobProvider({ children }: PropsWithChildren) {
  const { jobId } = useGlobalSearchParams();
  const [data, setData] = useState<IJob>();

  const refreshData = useCallback(
    () => fetchJobData(jobId as string).then(setData),
    [jobId]
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const value = useMemo(
    () => ({
      job: data || null,
      refreshData,
    }),
    [data, refreshData]
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}
