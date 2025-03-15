export const groups = [
  { name: "New", id: "new", color: "#428BCA" },
  { name: "In Progress", id: "in_progress", color: "#5CB85C" },
  { name: "Pending", id: "pending", color: "#F89200" },
  { name: "Done", id: "done", color: "#555555" },
  { name: "Closed", id: "closed", color: "#999999" },
] as const;

export const statuses = [
  {
    name: "New",
    description: "",
    group: "new",
  },
  {
    name: "In progress",
    description: "",
    group: "in_progress",
  },
  {
    name: "Accepted",
    description: "",
    group: "in_progress",
  },
  {
    name: "Approval",
    description: "",
    group: "pending",
  },
  {
    name: "Rejected",
    description: "",
    group: "pending",
  },
  {
    name: "Done",
    description: "",
    group: "done",
  },
  {
    name: "Closed",
    description: "",
    group: "closed",
  },
  {
    name: "Archived",
    description: "",
    group: "closed",
  },
  {
    name: "Dropped off - price",
    description: "",
    group: "dropped_off",
  },
  {
    name: "Dropped off - quality",
    description: "",
    group: "dropped_off",
  },
  {
    name: "Dropped off - terms",
    description: "",
    group: "dropped_off",
  },
];
