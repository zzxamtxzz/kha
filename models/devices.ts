import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import BillModel from "./bill";
import Client from "./client";
import User from "./user";

class DeviceModel extends Model {
  public _id!: string;
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
  public createdById!: number;
  public clientId!: string;
  public client!: Client;
}

DeviceModel.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    email: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    deviceSerial: { type: DataTypes.STRING },
    accNo: { type: DataTypes.STRING },
    kitNo: { type: DataTypes.STRING },
    serviceFee: { type: DataTypes.FLOAT },
    remark: { type: DataTypes.STRING },
    ref: { type: DataTypes.STRING },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
    lastBillId: {
      type: DataTypes.UUID,
      references: { model: BillModel, key: "_id" },
    },
    clientId: {
      type: DataTypes.UUID,
      references: { model: "clients", key: "_id" },
    },
    createdById: {
      type: DataTypes.UUID,
      references: { model: User, key: "_id" },
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

DeviceModel.belongsTo(User, { foreignKey: "createdById", as: "createdBy" });

DeviceModel.belongsTo(Client, { foreignKey: "clientId", as: "client" });
Client.hasMany(DeviceModel, { foreignKey: "clientId", as: "devices" });

export default DeviceModel;
