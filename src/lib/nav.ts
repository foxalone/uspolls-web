export const NAV: {
  href: string;
  label: string;
  icon: string;
  accent?: boolean;
}[] = [
  { href: "/", label: "Monitor", icon: "home" },
  { href: "/polls", label: "Polls", icon: "ballot" },
  { href: "/chambers", label: "Chambers", icon: "seats" },
  { href: "/odds", label: "Odds", icon: "odds" },
  { href: "/news", label: "News", icon: "news" },
  { href: "/admin", label: "Admin", icon: "admin", accent: true },
];
