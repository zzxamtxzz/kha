import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import Client from "./client";
import Role from "./role";
import { USER } from "@/roles";

class User extends Model {
  public id!: string;
  public name!: string;
  public username!: string;
  public role!: Role;
  public super_admin!: boolean;
  public email!: string;
  public password!: string;
  public profile!: any;
  public active!: boolean;
  public token?: string;
  public is_public!: boolean;
  public client_id!: string;
  public client!: Client;
  public created_by_id?: string;
  public created_by?: Client;
  public created_at!: Date;
  public updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: true },
    super_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    username: { type: DataTypes.STRING, allowNull: true, unique: true },
    role_id: {
      type: DataTypes.UUID,
      references: { model: "roles", key: "id" },
    },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_by_id: { type: DataTypes.UUID },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
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

User.belongsTo(User, { foreignKey: "id", as: "created_by" });

export default User;
