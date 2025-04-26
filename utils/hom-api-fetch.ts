import { supabase } from "@/lib/supabase";

export async function homApiFetch({
  endpoint,
  options,
}: {
  endpoint: string;
  options: RequestInit;
}) {
  if (endpoint.startsWith("/")) {
    throw new Error("Endpoint must not start with /");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    fetch(`${process.env.EXPO_PUBLIC_HOM_API_URL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "application/json",
      },
      ...options,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new Error(res.error);
        return res;
      })
      // eslint-disable-next-line no-console
      .catch(console.error)
  );
}
