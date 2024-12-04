import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class PlanModel extends Model {
  public _id!: string;
  public amountInPerMonth!: number;
  public serviceFee!: number;
  public name!: string;
  public remark!: string;
  public createdById!: string;
}

PlanModel.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    serviceFee: { type: DataTypes.FLOAT },
    amountInPerMonth: { type: DataTypes.FLOAT },
    remark: { type: DataTypes.STRING },
    createdById: {
      type: DataTypes.UUID,
      references: { model: User, key: "_id" },
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
  foreignKey: "createdById",
  as: "createdBy",
});

export default PlanModel;
