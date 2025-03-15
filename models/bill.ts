import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import Device from "./devices";
import Plan from "./plan";
import User from "./user";
import Status from "./statuses";
import Currency from "./currency";
import Branch from "./branch";

class Bill extends Model {
  public id!: string;
  public amount!: number;
  public fee!: number;
  public duration_month!: number;
  public billing_date!: Date;
  public remark!: string;
  public created_by!: User;
  public device!: Device;
  public device_id!: string;
  public branch_id!: string;
  public status_id!: string;
  public branch?: Branch;
  public plan_id?: string;
  public status?: Status;
  public currency_id!: string;
  public currency?: Currency;
  public plan?: Plan;
  public created_by_id!: string;
  public is_public!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Bill.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    duration_month: { type: DataTypes.FLOAT },
    amount: { type: DataTypes.FLOAT },
    fee: { type: DataTypes.FLOAT },
    billing_date: { type: DataTypes.DATE },
    remark: { type: DataTypes.STRING },
    status_id: {
      type: DataTypes.UUID,
      references: { model: "statuses", key: "id" },
    },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    device_id: {
      type: DataTypes.UUID,
      references: { model: "devices", key: "id" },
    },
    branch_id: {
      type: DataTypes.UUID,
      references: { model: "branches", key: "id" },
    },
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
    modelName: "Bill",
    tableName: "bills",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Bill.belongsTo(User, { foreignKey: "created_by_id", as: "created_by" });
Bill.belongsTo(Plan, { foreignKey: "plan_id", as: "plan" });
Bill.belongsTo(Status, { foreignKey: "status_id", as: "status" });
Bill.belongsTo(Currency, { foreignKey: "currency_id", as: "currency" });
Bill.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });

Bill.belongsTo(Device, { foreignKey: "device_id", as: "device" });
Device.hasMany(Bill, { foreignKey: "device_id", as: "bills" });

Device.belongsTo(Bill, { as: "lastBill", foreignKey: "last_bill_id" });
Bill.hasOne(Device, { as: "lastBill", foreignKey: "last_bill_id" });

export default Bill;

// limitless
// startlink myanmar
// star gateaway
