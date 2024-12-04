import mysql2 from "mysql2";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.DB_USER,
  dialectModule: mysql2,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  models: [__dirname + "/models"],
});

export default sequelize;
