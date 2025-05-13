export function formatAsCompactNumber(value: number) {
  if (value < 1e3) return Number(value).toString();
  if (value < 1e6) return `${Math.floor(value / 1e2) / 10}K`;
  if (value < 1e9) return `${Math.floor(value / 1e5) / 10}M`;

  return `${Math.floor(value / 1e8) / 10}B`;
}
