import sequelize from "@/lib/mysql";
import { generateSecureRandomId } from "@/lib/utils";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class Session extends Model {
  public id!: string;
  public expires!: Date;
  public session!: any;
  public user_id!: number;
  public is_public!: boolean;
}

Session.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => generateSecureRandomId(15),
      primaryKey: true,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    session: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    user: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users", // Assumes you have an Employee model
        key: "id",
      },
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Session",
    tableName: "sessions",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Session.belongsTo(User, { foreignKey: "user" });

export default Session;
