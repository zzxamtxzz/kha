// src/lib/seed.ts

import { statuses } from "@/data/statuses";
import Status from "@/models/statuses";

export const seed = async () => {
  // await sequelize.sync({ alter: true });
  await Status.bulkCreate(statuses);
  console.log("Database seeded!");
};
