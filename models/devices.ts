import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Model,
} from "sequelize";
import Bill from "./bill";
import Branch from "./branch";
import BranchDevice from "./branch_device";
import Client from "./client";
import User from "./user";

class Device extends Model {
  public id!: string;
  public email!: string;
  public snNo!: string;
  public accNo!: string;
  public first_name!: string;
  public last_name!: string;
  public kitNo!: string;
  public fee!: number;
  public due_date!: Date;
  public remark!: string;
  public ref!: string;
  public created_by!: User;
  public is_public!: boolean;
  public last_bill_id!: number;
  public lastBill!: Bill;
  public bills!: Bill[];
  public created_by_id!: number;
  public client_id!: string;
  public client!: Client;
  public created_at!: Date;
  public updated_at!: Date;

  // Association mixins
  declare getBranches: HasManyGetAssociationsMixin<Branch>;
  declare addBranch: HasManyAddAssociationMixin<Branch, string>;
  declare addBranches: HasManyAddAssociationsMixin<Branch, string>;
  declare setBranches: HasManySetAssociationsMixin<Branch, string>;
  declare removeBranch: HasManyRemoveAssociationMixin<Branch, string>;
  declare removeBranches: HasManyRemoveAssociationsMixin<Branch, string>;
  declare hasBranch: HasManyHasAssociationMixin<Branch, string>;
  declare hasBranches: HasManyHasAssociationsMixin<Branch, string>;
  declare countBranches: HasManyCountAssociationsMixin;
  declare createBranch: HasManyCreateAssociationMixin<Branch>;
}

Device.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    email: { type: DataTypes.STRING },
    snNo: { type: DataTypes.STRING },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    accNo: { type: DataTypes.STRING },
    kitNo: { type: DataTypes.STRING },
    remark: { type: DataTypes.STRING },
    due_date: { type: DataTypes.DATEONLY },
    ref: { type: DataTypes.STRING },
    region_id: { type: DataTypes.UUID },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    last_bill_id: {
      type: DataTypes.UUID,
      references: { model: "bills", key: "id" },
    },
    client_id: {
      type: DataTypes.UUID,
      references: { model: "clients", key: "id" },
    },
    branch_id: {
      type: DataTypes.UUID,
      references: { model: "branches", key: "id" },
    },
    created_by_id: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
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

Device.belongsToMany(Branch, {
  through: BranchDevice,
  foreignKey: "device_id",
  otherKey: "branch_id",
  as: "branches",
});

Branch.belongsToMany(Device, {
  through: BranchDevice,
  foreignKey: "branch_id",
  otherKey: "device_id",
  as: "devices",
});

Device.belongsTo(User, { foreignKey: "created_by_id", as: "created_by" });
Device.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });

Device.belongsTo(Client, { foreignKey: "client_id", as: "client" });
Client.hasMany(Device, { foreignKey: "client_id", as: "devices" });

export default Device;
