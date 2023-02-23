import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelize from '../db.js';

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export const User = sequelize.define<UserModel>(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  },
);

export const File = sequelize.define(
  'file',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: false,
    },
    info: {
      type: DataTypes.STRING,
      unique: false,
    },
    filePath: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: '',
    },
    type: {
      type: DataTypes.STRING,
      unique: false,
      defaultValue: 'file',
    },
  },
  {
    timestamps: true,
  },
);

User.hasMany(File, { foreignKey: 'userId' });
File.belongsTo(User);

export type { UserModel };
