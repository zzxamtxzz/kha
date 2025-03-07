import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class UpdateModel extends Model {
  public id!: string;
  public user!: User;
  public user_id!: number;
  public data!: any;
  public is_public!: boolean;
  public title!: string;
  public content_id!: number;
  public fromModel!: string;
  public created_at!: Date; // Adjust the type as needed
  public updated_at!: Date; // Adjust the type as needed
}

UpdateModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    data: { type: DataTypes.JSON },
    title: { type: DataTypes.STRING },
    content_id: { type: DataTypes.UUID },
    user_id: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Update",
    tableName: "updates",
    timestamps: true,
    freezeTableName: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default UpdateModel;
