import { twMerge } from "tailwind-merge";

export function mergeClasses(...classes: (string | undefined | null | false)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
