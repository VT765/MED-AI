/**
 * Single source for API base URL. Uses relative path so Vite proxy works in dev.
 */
export const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE) || "";

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
