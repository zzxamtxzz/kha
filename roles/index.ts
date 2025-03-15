const DELETE = "DELETE";
const UPDATE = "UPDATE";
const READ = "READ";
const CREATE = "CREATE";

export const actions = {
  CREATE,
  READ,
  UPDATE,
  DELETE,
};

export const roles = [
  {
    name: "user",
    home: ["read"],
    devices: ["read"],
    bills: ["read", "create"],
    plans: ["read"],
  },
];

export const ADMIN = "admin";
export const USER = "user";
