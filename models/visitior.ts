import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class Visitor extends Model {
  public id!: string;
  public user!: User;
  public userId!: number;
  public isPublic!: boolean;
  public location!: any; // Adjust the type as needed
  public name!: string; // Adjust the type as needed
  public os!: string; // Adjust the type as needed
  public type!: string; // Adjust the type as needed
  public createdAt!: Date; // Adjust the type as needed
  public updatedAt!: Date; // Adjust the type as needed
}

Visitor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
    location: { type: DataTypes.GEOMETRY("POINT"), allowNull: true },
    name: { type: DataTypes.STRING },
    os: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
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
    modelName: "Visitor",
    tableName: "visitors",
    timestamps: true,
    freezeTableName: true,
  }
);

User.hasMany(Visitor, { foreignKey: "userId", as: "visitors" });
Visitor.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Visitor;
