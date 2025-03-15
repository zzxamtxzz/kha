import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";
import Currency from "./currency";

class Plan extends Model {
  public id!: string;
  public edit?: string;
  public amount!: number;
  public fee!: number;
  public name!: string;
  public duration_month!: number;
  public currency?: Currency;
  public admin_amount!: string;
  public remark!: string;
  public created_by_id!: string;
}

Plan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    fee: { type: DataTypes.FLOAT },
    amount: { type: DataTypes.FLOAT },
    admin_amount: { type: DataTypes.FLOAT },
    duration_month: { type: DataTypes.FLOAT },
    remark: { type: DataTypes.STRING },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    currency_id: {
      type: DataTypes.UUID,
      references: { model: "currencies", key: "id" },
    },
    created_by_id: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Plan",
    tableName: "plans",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Plan.belongsTo(User, { foreignKey: "created_by_id", as: "created_by" });
Plan.belongsTo(Currency, { foreignKey: "currency_id", as: "currency" });

export default Plan;
