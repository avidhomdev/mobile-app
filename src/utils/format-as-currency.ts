export function formatAsCurrency(
  value: number,
  options?: Intl.NumberFormatOptions
) {
  return Number(value).toLocaleString(undefined, {
    currency: "USD",
    ...options,
    style: "currency",
  });
}
