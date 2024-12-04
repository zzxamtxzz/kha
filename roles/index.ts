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
    home: [actions.READ],
    devices: [actions.READ],
    bills: [actions.READ, actions.CREATE],
    plans: [actions.READ],
  },
];

export const ADMIN = "admin";
export const USER = "user";
