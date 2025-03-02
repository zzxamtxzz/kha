import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import BillModel from "./bill";
import Client from "./client";
import DeviceModel from "./devices";
import User from "./user";

class TrashModel extends Model {
  public id!: string;
  public user!: User;
  public userId!: number;
  public isPublic!: boolean;
  public title!: string;
  public contentId!: number;
  public fromModel!: string;
  public createdAt!: Date; // Adjust the type as needed
  public updatedAt!: Date; // Adjust the type as needed
  public client!: Client; // Adjust the type as needed
  public bill!: BillModel; // Adjust the type as needed
  public device!: DeviceModel; // Adjust the type as needed
}

TrashModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
    title: { type: DataTypes.STRING },
    contentId: { type: DataTypes.UUID },
    fromModel: { type: DataTypes.STRING },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users", // Assumes you have an Employee model
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Trash",
    tableName: "trashes",
    timestamps: true,
    freezeTableName: true,
  }
);

User.hasMany(TrashModel, { foreignKey: "userId", as: "trashes" });
TrashModel.belongsTo(User, { foreignKey: "userId", as: "user" });

// Polymorphic Associations
TrashModel.belongsTo(DeviceModel, {
  foreignKey: "contentId",
  constraints: false,
  as: "device",
});
TrashModel.belongsTo(Client, {
  foreignKey: "contentId",
  constraints: false,
  as: "client",
});
TrashModel.belongsTo(BillModel, {
  foreignKey: "contentId",
  constraints: false,
  as: "bill",
});

DeviceModel.hasMany(TrashModel, {
  foreignKey: "contentId",
  constraints: false,
  scope: { contentType: "DeviceModel" },
});
Client.hasMany(TrashModel, {
  foreignKey: "contentId",
  constraints: false,
  scope: { contentType: "ClientModel" },
});
BillModel.hasMany(TrashModel, {
  foreignKey: "contentId",
  constraints: false,
  scope: { contentType: "BillModel" },
});

export default TrashModel;
