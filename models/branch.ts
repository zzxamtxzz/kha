import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class Branch extends Model {
  public id!: string;
  public name!: string;
  public remark!: string;
  public created_by_id!: string;
  public is_public!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Branch.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    remark: { type: DataTypes.STRING },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_by_id: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Branch",
    tableName: "branches",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Branch.belongsTo(User, { foreignKey: "created_by_id", as: "created_by" });

export default Branch;
