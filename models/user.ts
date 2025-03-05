import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import Client from "./client";

class User extends Model {
  public id!: string;
  public name!: string;
  public role!: "admin" | "user";
  public email!: string;
  public password!: string; // Add this line
  public profile!: any; // Add this line
  public active!: boolean;
  public is_public!: boolean;
  public client_id!: string;
  public client!: Client;
}

User.init(
  {
    id: {
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
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    client_id: {
      type: DataTypes.UUID,
      references: { model: "clients", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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

User.belongsTo(Client, { foreignKey: "client_id", as: "client" }); // Add this line
Client.hasOne(User, { foreignKey: "client_id", as: "user" }); // Add this line
Client.belongsTo(User, { foreignKey: "created_by_id", as: "created_by" });

export default User;
