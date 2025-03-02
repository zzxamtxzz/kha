import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import BillModel from "./bill";
import Client from "./client";
import User from "./user";

class DeviceModel extends Model {
  public id!: string;
  public email!: string;
  public name!: string;
  public deviceSerial!: string;
  public accNo!: string;
  public kitNo!: string;
  public serviceFee!: number;
  public remark!: string;
  public ref!: string;
  public createdBy!: User;
  public isPublic!: boolean;
  public lastBillId!: number;
  public lastBill!: BillModel;
  public created_by_id!: number;
  public client_id!: string;
  public client!: Client;
}

DeviceModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING },
    deviceSerial: { type: DataTypes.STRING },
    accNo: { type: DataTypes.STRING },
    kitNo: { type: DataTypes.STRING },
    remark: { type: DataTypes.STRING },
    ref: { type: DataTypes.STRING },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
    lastBillId: {
      type: DataTypes.UUID,
      references: { model: BillModel, key: "id" },
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
  }
);

DeviceModel.hasMany(BillModel, { foreignKey: "deviceId", as: "device" });
BillModel.belongsTo(DeviceModel, { foreignKey: "deviceId", as: "device" });

DeviceModel.belongsTo(BillModel, { as: "lastBill", foreignKey: "lastBillId" });
BillModel.hasOne(DeviceModel, { as: "lastBill", foreignKey: "lastBillId" });

DeviceModel.belongsTo(User, { foreignKey: "created_by_id", as: "createdBy" });

DeviceModel.belongsTo(Client, { foreignKey: "client_id", as: "client" });
Client.hasMany(DeviceModel, { foreignKey: "client_id", as: "devices" });

export default DeviceModel;
