export default function formatEmptyAsNa(val: unknown) {
  if (Boolean(val)) return val;
  return "NA";
}
