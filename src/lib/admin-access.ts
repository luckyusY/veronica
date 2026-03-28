export const adminRoles = ["owner", "content", "bookings", "media"] as const;

export type AdminRole = (typeof adminRoles)[number];

export type AdminNavIconKey =
  | "overview"
  | "content"
  | "settings"
  | "media"
  | "releases"
  | "events"
  | "products"
  | "inquiries";

export type AdminNavItem = {
  href: string;
  label: string;
  iconKey: AdminNavIconKey;
  roles: readonly AdminRole[];
};

export type AdminNavGroup = {
  label: string;
  items: readonly AdminNavItem[];
};

export const adminRoleLabels: Record<AdminRole, string> = {
  owner: "Owner",
  content: "Content",
  bookings: "Bookings",
  media: "Media",
};

export const adminNavGroups: readonly AdminNavGroup[] = [
  {
    label: "Publishing",
    items: [
      {
        href: "/admin",
        label: "Overview",
        iconKey: "overview",
        roles: adminRoles,
      },
      {
        href: "/admin/content",
        label: "Page Content",
        iconKey: "content",
        roles: ["owner", "content"],
      },
      {
        href: "/admin/settings",
        label: "Global Settings",
        iconKey: "settings",
        roles: ["owner", "content"],
      },
      {
        href: "/admin/media",
        label: "Media Library",
        iconKey: "media",
        roles: ["owner", "content", "media"],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/admin/releases",
        label: "Releases",
        iconKey: "releases",
        roles: ["owner"],
      },
      {
        href: "/admin/events",
        label: "Events",
        iconKey: "events",
        roles: ["owner", "bookings"],
      },
      {
        href: "/admin/products",
        label: "Products",
        iconKey: "products",
        roles: ["owner"],
      },
      {
        href: "/admin/inquiries",
        label: "Inquiries",
        iconKey: "inquiries",
        roles: ["owner", "bookings"],
      },
    ],
  },
] as const;

const adminPathPermissions: Array<{
  matcher: RegExp;
  roles: readonly AdminRole[];
}> = [
  { matcher: /^\/admin$/, roles: adminRoles },
  { matcher: /^\/admin\/content(?:\/|$)/, roles: ["owner", "content"] },
  { matcher: /^\/admin\/settings(?:\/|$)/, roles: ["owner", "content"] },
  { matcher: /^\/admin\/media(?:\/|$)/, roles: ["owner", "content", "media"] },
  { matcher: /^\/admin\/releases(?:\/|$)/, roles: ["owner"] },
  { matcher: /^\/admin\/events(?:\/|$)/, roles: ["owner", "bookings"] },
  { matcher: /^\/admin\/products(?:\/|$)/, roles: ["owner"] },
  { matcher: /^\/admin\/inquiries(?:\/|$)/, roles: ["owner", "bookings"] },
];

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && adminRoles.includes(value as AdminRole);
}

export function canAccessAdminPath(role: AdminRole, pathname: string) {
  const matchingRule = adminPathPermissions.find((rule) => rule.matcher.test(pathname));

  if (!matchingRule) {
    return role === "owner";
  }

  return matchingRule.roles.includes(role);
}

export function getVisibleAdminNavGroups(role: AdminRole) {
  return adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}
