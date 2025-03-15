import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";

class Status extends Model {
  public id!: string;
  public name!: string;
  public group!: string;
}

Status.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    group: {
      type: DataTypes.ENUM(
        "new",
        "in_progress",
        "pending",
        "done",
        "closed",
        "dropped_off"
      ),
      allowNull: false,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by_id: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Status",
    tableName: "statuses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Status;
