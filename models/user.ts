import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import Client from "./client";

class User extends Model {
  public _id!: string;
  public name!: string;
  public role!: "admin" | "user";
  public email!: string;
  public password!: string; // Add this line
  public profile!: any; // Add this line

  public active!: boolean;
  public isPublic!: boolean;
  public clientId!: string;
  public client!: Client;
}

User.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: true, unique: true },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },

    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
    clientId: {
      type: DataTypes.UUID,
      references: { model: "clients", key: "_id" },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    freezeTableName: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
  }
);

User.belongsTo(Client, { foreignKey: "clientId", as: "client" }); // Add this line
Client.hasOne(User, { foreignKey: "clientId", as: "user" }); // Add this line
Client.belongsTo(User, { foreignKey: "createdById", as: "createdBy" });

export default User;
