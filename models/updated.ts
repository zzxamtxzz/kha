import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class UpdateModel extends Model {
  public id!: string;
  public user!: User;
  public userId!: number;
  public data!: any;
  public isPublic!: boolean;
  public title!: string;
  public contentId!: number;
  public fromModel!: string;
  public createdAt!: Date; // Adjust the type as needed
  public updatedAt!: Date; // Adjust the type as needed
}

UpdateModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
    data: { type: DataTypes.JSON },
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
    modelName: "Update",
    tableName: "updates",
    timestamps: true,
    freezeTableName: true,
  }
);

export default UpdateModel;
