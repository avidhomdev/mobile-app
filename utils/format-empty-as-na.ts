export default function formatEmptyAsNa(val: unknown) {
  if (val) return val;
  return "NA";
}
