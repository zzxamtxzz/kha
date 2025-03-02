import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class PlanModel extends Model {
  public id!: string;
  public amountInPerMonth!: number;
  public serviceFee!: number;
  public name!: string;
  public remark!: string;
  public created_by_id!: string;
}

PlanModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    serviceFee: { type: DataTypes.FLOAT },
    amountInPerMonth: { type: DataTypes.FLOAT },
    remark: { type: DataTypes.STRING },
    created_by_id: {
      type: DataTypes.UUID,
      references: { model: User, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Plan",
    tableName: "plans",
    timestamps: true,
  }
);

PlanModel.belongsTo(User, {
  foreignKey: "created_by_id",
  as: "createdBy",
});

export default PlanModel;
