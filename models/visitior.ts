import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class Visitor extends Model {
  public id!: string;
  public user!: User;
  public user_id!: number;
  public is_public!: boolean;
  public location!: any; // Adjust the type as needed
  public name!: string; // Adjust the type as needed
  public os!: string; // Adjust the type as needed
  public type!: string; // Adjust the type as needed
  public created_at!: Date; // Adjust the type as needed
  public updated_at!: Date; // Adjust the type as needed
}

Visitor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    location: { type: DataTypes.GEOMETRY("POINT"), allowNull: true },
    name: { type: DataTypes.STRING },
    os: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
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
    modelName: "Visitor",
    tableName: "visitors",
    timestamps: true,
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

User.hasMany(Visitor, { foreignKey: "user_id", as: "visitors" });
Visitor.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Visitor;
