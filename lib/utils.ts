import { format } from "date-fns";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function isNewArrival(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff <= 3 * 24 * 60 * 60 * 1000;
}

export function todayString() {
  return format(new Date(), "yyyy-MM-dd");
}

export async function withTimeout<T>(
  promise: Promise<T>,
  fallback: T,
  ms = 4000
) {
  let timeoutId: NodeJS.Timeout | undefined;
  const timer = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), ms);
  });
  const result = await Promise.race([promise, timer]);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  return result;
}
