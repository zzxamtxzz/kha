export const modules = [
  "bills",
  "clients",
  "currencies",
  "plans",
  "devices",
  "branches",
  "users",
];

export type PermissionType = (typeof modules)[number];
