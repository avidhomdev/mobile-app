export function formatMinutesToHoursAndMinutes(minutes: number = 0) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${Number.isNaN(hours) ? 0 : hours} hrs${
    remainingMinutes > 0 ? `, ${remainingMinutes} mins` : ""
  }`;
}
