export function mergeClasses(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
