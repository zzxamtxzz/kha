import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import PlanModel from "./billplan";
import DeviceModel from "./devices";
import User from "./user";

class BillModel extends Model {
  public id!: string;
  public amount!: number;
  public serviceFee!: number;
  public durationMonth!: number;
  public billingDate!: Date;
  public remark!: string;
  public createdBy!: User;
  public device!: DeviceModel;
  public deviceId!: string;
  public planId!: string;
  public plan!: PlanModel;
  public created_by_id!: string;
  public isPublic!: boolean;
}

BillModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    serviceFee: { type: DataTypes.FLOAT },
    durationMonth: { type: DataTypes.FLOAT },
    amount: { type: DataTypes.FLOAT },
    billingDate: { type: DataTypes.DATE },
    remark: { type: DataTypes.STRING },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
    deviceId: {
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
  }
);

BillModel.belongsTo(User, { foreignKey: "created_by_id", as: "createdBy" });
BillModel.belongsTo(PlanModel, { foreignKey: "planId", as: "plan" });

export default BillModel;
