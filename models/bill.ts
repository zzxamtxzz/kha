import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import PlanModel from "./billplan";
import Device from "./devices";
import User from "./user";

class BillModel extends Model {
  public id!: string;
  public amount!: number;
  public fee!: number;
  public duration_month!: number;
  public billing_date!: Date;
  public remark!: string;
  public created_by!: User;
  public device!: Device;
  public device_id!: string;
  public plan_id!: string;
  public plan!: PlanModel;
  public created_by_id!: string;
  public is_public!: boolean;
}

BillModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    fee: { type: DataTypes.FLOAT },
    duration_month: { type: DataTypes.FLOAT },
    amount: { type: DataTypes.FLOAT },
    billing_date: { type: DataTypes.DATE },
    remark: { type: DataTypes.STRING },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    device_id: {
      type: DataTypes.UUID,
      references: { model: "devices", key: "id" },
    },
    created_by_id: {
      type: DataTypes.UUID,
      references: { model: User, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Bill",
    tableName: "bills",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

BillModel.belongsTo(User, { foreignKey: "created_by_id", as: "created_by" });
BillModel.belongsTo(PlanModel, { foreignKey: "plan_id", as: "plan" });

export default BillModel;
