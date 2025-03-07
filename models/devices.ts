import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import Bill from "./bill";
import Client from "./client";
import User from "./user";
import DeviceEmail from "./device_email";

class Device extends Model {
  public id!: string;
  public email!: string;
  public device_serial!: string;
  public account_number!: string;
  public kit_number!: string;
  public fee!: number;
  public remark!: string;
  public ref!: string;
  public created_by!: User;
  public is_public!: boolean;
  public last_bill_id!: number;
  public lastBill!: Bill;
  public created_by_id!: number;
  public client_id!: string;
  public client!: Client;
}

Device.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    email: { type: DataTypes.STRING },
    device_serial: { type: DataTypes.STRING },
    account_number: { type: DataTypes.STRING },
    kit_number: { type: DataTypes.STRING },
    remark: { type: DataTypes.STRING },
    ref: { type: DataTypes.STRING },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    last_bill_id: {
      type: DataTypes.UUID,
      references: { model: Bill, key: "id" },
    },
    client_id: {
      type: DataTypes.UUID,
      references: { model: "clients", key: "id" },
    },
    created_by_id: {
      type: DataTypes.UUID,
      references: { model: User, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Device",
    tableName: "devices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Device.hasMany(DeviceEmail, { foreignKey: "device_id", as: "emails" });
DeviceEmail.belongsTo(Device, { foreignKey: "device_id", as: "device" });

Device.hasMany(Bill, { foreignKey: "device_id", as: "device" });
Bill.belongsTo(Device, { foreignKey: "device_id", as: "device" });

Device.belongsTo(Bill, { as: "lastBill", foreignKey: "last_bill_id" });
Bill.hasOne(Device, { as: "lastBill", foreignKey: "last_bill_id" });

Device.belongsTo(User, { foreignKey: "created_by_id", as: "created_by" });

Device.belongsTo(Client, { foreignKey: "client_id", as: "client" });
Client.hasMany(Device, { foreignKey: "client_id", as: "devices" });

export default Device;
