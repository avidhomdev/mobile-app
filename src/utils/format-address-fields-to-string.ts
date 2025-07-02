export function formatAddressFieldsToString({
  address,
  address2,
  city,
  state,
  postal_code,
}: {
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}) {
  return `${address || ""}${address2 ? ` ${address2}` : ""}, ${city || ""} ${
    state || ""
  } ${postal_code || ""}`;
}
