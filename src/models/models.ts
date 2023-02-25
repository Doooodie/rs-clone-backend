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

export interface FileModel
  extends Model<InferAttributes<FileModel>, InferCreationAttributes<FileModel>> {
  id?: number;
  name: string;
  size: number;
  info: string;
  filePath: string;
  parentPath: string;
  type: string;
  userId?: number;
}

export const File = sequelize.define<FileModel>(
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
    parentPath: {
      type: DataTypes.STRING,
      unique: false,
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
