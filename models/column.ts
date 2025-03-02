import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class TableColumn extends Model {
  public id!: string;
  public title!: number;
  public columns!: any;
  public userId!: string;
  public user!: User;
  public isPublic!: boolean;
}

TableColumn.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    title: { type: DataTypes.STRING },
    columns: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    user: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Column",
    tableName: "columns",
    timestamps: true,
  }
);

TableColumn.belongsTo(User, { foreignKey: "user" });

export default TableColumn;
