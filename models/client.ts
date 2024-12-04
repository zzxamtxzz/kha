import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class Client extends Model {
  public _id!: string;
  public email!: string;
  public name!: string;
  public remark!: string;
  public createdById!: string;
  public createdBy!: User;
  public createdAt!: Date;
  public isPublic!: boolean;
  public deviceCount!: number;
  public user!: User;
  public userId!: string;
  public ref!: string;
}

Client.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    email: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    remark: { type: DataTypes.STRING },
    ref: { type: DataTypes.STRING },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdById: {
      type: DataTypes.UUID,
      references: { model: "users", key: "_id" },
    },
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "clients",
    timestamps: true,
  }
);

export default Client;
