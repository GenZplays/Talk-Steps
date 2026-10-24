import type { Result } from "@/lib/store";

export function norm(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function saidWell(heard: string, target: string): Result {
  const h = norm(heard);
  const t = norm(target);
  if (!h || !t) return "again";
  if (h === t || h.includes(t)) return "clear";
  const words = t.split(" ").filter((word) => word.length > 2);
  if (words.length === 0) return "again";
  const hit = words.filter((word) => h.includes(word)).length;
  if (hit === words.length) return "clear";
  if (hit >= Math.ceil(words.length / 2)) return "close";
  return "again";
}

export function hash(value: string) {
  let h = 0;
  for (const char of value) h = (h * 31 + char.charCodeAt(0)) >>> 0;
  return h;
}
