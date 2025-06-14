import { supabase } from "@/src/lib/supabase";

export async function homApiFetch({
  endpoint,
  options,
  responseType = "json",
}: {
  endpoint: string;
  options: RequestInit;
  responseType?: "json" | "text" | "blob";
}) {
  if (endpoint.startsWith("/")) {
    throw new Error("Endpoint must not start with /");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return fetch(`${process.env.EXPO_PUBLIC_HOM_API_URL}/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
  })
    .then((res) => res[responseType]())
    .then((res) => {
      if (res.error) throw new Error(res.error);
      return res;
    });
}
