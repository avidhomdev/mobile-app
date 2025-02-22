import { supabase } from "@/lib/supabase";
import { memo, useEffect, useState } from "react";
import { Image } from "./ui/image";

type TUseSupabaseSignedImage = {
  path: string;
  cacheInSeconds?: number;
  size?: "lg" | "sm" | "md" | "xl" | "2xl" | "2xs" | "xs" | "full" | "none";
};

function useSupabaseSignedImage({
  path,
  cacheInSeconds = 86400,
}: TUseSupabaseSignedImage) {
  const [uri, setUri] = useState("");

  useEffect(() => {
    const fetchSignedUrl = async () => {
      return supabase.storage
        .from("business")
        .createSignedUrl(path, cacheInSeconds)
        .then(({ data }) => data!.signedUrl);
    };

    fetchSignedUrl().then(setUri);
  }, [path]);

  return { uri };
}

function SupabaseSignedImage({
  path,
  cacheInSeconds,
  size,
}: TUseSupabaseSignedImage) {
  const { uri } = useSupabaseSignedImage({ path, cacheInSeconds });

  return (
    uri && (
      <Image
        source={uri}
        alt={path}
        className="bg-gray-100 aspect-square"
        key={path}
        size={size}
      />
    )
  );
}

export default memo(SupabaseSignedImage);
