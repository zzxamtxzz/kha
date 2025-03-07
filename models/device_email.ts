import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";

class DeviceEmail extends Model {}

DeviceEmail.init(
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
    email: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "DeviceEmail",
    tableName: "devices_emails",
    timestamps: false,
  }
);

export default DeviceEmail;
