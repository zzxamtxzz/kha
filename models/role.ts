import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/mysql";
import User from "./user";
import { generateSecureRandomId } from "@/lib/utils";
import { modules, PermissionType } from "@/utils/name";

type Permissions = {
  [K in PermissionType]?: ["create", "read", "update", "delete"];
};

class Role extends Model {
  public id!: string;
  public name!: string;
  public description?: string;
  public created_by_id!: string;
  public created_by!: User;
  public all_records!: string;
  public allow_login!: boolean;
  public is_management!: boolean;
  public permissions!: Permissions;
  public is_public!: boolean;
  public created_at!: Date;
  public updated_at!: Date;

  public roles?: boolean;
  public branches?: boolean;
  public devices?: boolean;
  public clients?: boolean;
  public users?: boolean;
  public bills?: boolean;
}

const modelAttributes = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => generateSecureRandomId(15),
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  permissions: { type: DataTypes.JSON },
  all_records: { type: DataTypes.JSON },
  is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_by_id: {
    type: DataTypes.UUID,
    references: { model: "users", key: "id" },
    allowNull: false,
  },
};

// Add attributes from navigation array
modules.forEach((attribute) => {
  modelAttributes[attribute] = {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  };
});

Role.init(modelAttributes, {
  sequelize,
  modelName: "Role",
  tableName: "roles",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

User.belongsTo(Role, { foreignKey: "role_id", as: "role" });
Role.belongsTo(User, { foreignKey: "created_by_id", as: "created_by" });

export default Role;
