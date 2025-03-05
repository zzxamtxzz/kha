import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class Client extends Model {
  public id!: string;
  public email!: string;
  public name!: string;
  public first_name!: string;
  public last_name!: string;
  public remark!: string;
  public created_by_id!: string;
  public created_by!: User;
  public created_at!: Date;
  public is_public!: boolean;
  public deviceCount!: number;
  public user!: User;
  public user_id!: string;
  public ref!: string;
}

Client.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    email: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    phone_number: { type: DataTypes.STRING },
    remark: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    ref: { type: DataTypes.STRING },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_by_id: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "clients",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Client;
