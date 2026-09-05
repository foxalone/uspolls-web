export const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "mityabv@gmail.com")
  .trim()
  .toLowerCase();

export function isAdminEmail(email: string | null | undefined) {
  return (email || "").trim().toLowerCase() === ADMIN_EMAIL;
}
