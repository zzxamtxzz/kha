import sequelize from "@/lib/mysql";
import { DataTypes, Model } from "sequelize";
import { generateSecureRandomId } from "@/lib/utils";
import User from "./user";
import Bill from "./bill";
import Status from "./statuses";

class EventTracking extends Model {
  public id!: string;
  public event_name!: string;
  public from!: User;
  public description!: string;
  public event_date!: Date;
  public event_type!: "status" | "comment" | "task" | "file";
  public status_id!: string;
  public status!: Status;
  public notes!: string;
  public created_by_id!: string;
  public created_by!: User;
  public created_at!: Date;
  public updated_at!: Date;
}

EventTracking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    data_id: { type: DataTypes.UUID, allowNull: false },
    event_type: { type: DataTypes.ENUM("status", "comment", "task", "file") },
    event_name: { type: DataTypes.STRING, allowNull: false },
    from: { type: DataTypes.UUID, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "statuses", key: "id" },
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
    created_by_id: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "events",
    timestamps: true,
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

EventTracking.belongsTo(Status, { foreignKey: "status_id", as: "status" });
EventTracking.belongsTo(User, {
  foreignKey: "created_by_id",
  as: "created_by",
});

export default EventTracking;
