import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";

class BranchDevice extends Model {}

BranchDevice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    device_id: {
      type: DataTypes.UUID,
      references: { model: "devices", key: "id" },
    },
    branch_id: {
      type: DataTypes.UUID,
      references: { model: "branches", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "BranchDevice",
    tableName: "branches_devices",
    timestamps: false,
  }
);

export default BranchDevice;
