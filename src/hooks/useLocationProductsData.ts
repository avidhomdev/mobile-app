import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/supabase";
import { useEffect, useState } from "react";

export interface IProduct extends Tables<"business_products"> {
  locations: Tables<"business_product_locations">[];
  units: number;
}

export const useLocationProductsData = ({
  locationId,
}: {
  locationId: number;
}) => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () =>
      supabase
        .from("business_products")
        .select(
          `
          *,
          locations: business_product_locations!inner(*)
          `
        )
        .match({
          "business_product_locations.status": 1,
          "business_product_locations.location_id": locationId,
        })
        .returns<IProduct[]>()
        .then(({ data }) => data || []);

    fetchProducts().then(setProducts);
  }, [locationId]);

  return {
    products,
  };
};
