export function startOfDay(date: Date) {
  const dt = new Date(date);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export function endOfDay(date: Date) {
  const dt = new Date(date);
  dt.setHours(23, 59, 59, 999);
  return dt;
}
