import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import Bill from "./bill";
import Client from "./client";
import Device from "./devices";
import User from "./user";

class TrashModel extends Model {
  public id!: string;
  public user!: User;
  public user_id!: number;
  public is_public!: boolean;
  public title!: string;
  public content_id!: number;
  public fromModel!: string;
  public created_at!: Date; // Adjust the type as needed
  public updated_at!: Date; // Adjust the type as needed
  public client!: Client; // Adjust the type as needed
  public bill!: Bill; // Adjust the type as needed
  public device!: Device; // Adjust the type as needed
}

TrashModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    title: { type: DataTypes.STRING },
    content_id: { type: DataTypes.UUID },
    user_id: {
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

User.hasMany(TrashModel, { foreignKey: "user_id", as: "trashes" });
TrashModel.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Polymorphic Associations
TrashModel.belongsTo(Device, {
  foreignKey: "content_id",
  constraints: false,
  as: "device",
});
TrashModel.belongsTo(Client, {
  foreignKey: "content_id",
  constraints: false,
  as: "client",
});
TrashModel.belongsTo(Bill, {
  foreignKey: "content_id",
  constraints: false,
  as: "bill",
});

Device.hasMany(TrashModel, {
  foreignKey: "content_id",
  constraints: false,
  scope: { contentType: "Device" },
});
Client.hasMany(TrashModel, {
  foreignKey: "content_id",
  constraints: false,
  scope: { contentType: "ClientModel" },
});
Bill.hasMany(TrashModel, {
  foreignKey: "content_id",
  constraints: false,
  scope: { contentType: "Bill" },
});

export default TrashModel;
