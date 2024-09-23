import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// create a function to convert a date string to a string showing date like 15th march
export function formatDate(date: string) {
  const d = new Date(date);
  return {
    day: d.getDate(),
    month: d.toLocaleString("default", { month: "short" }),
  };
}
