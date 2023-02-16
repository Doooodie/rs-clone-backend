import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

export const User = sequelize.define(
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
      primaryKey: false,
    },
    size: {
      type: DataTypes.INTEGER,
      primaryKey: false,
    },
    info: {
      type: DataTypes.STRING,
      unique: false,
    },
    img: {
      type: DataTypes.STRING,
      unique: true,
    },
    isFile: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: true,
  },
);

export const Comment = sequelize.define(
  'comment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      unique: false,
    },
  },
  {
    timestamps: false,
  },
);

export const Access = sequelize.define(
  'access',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
  },
);

User.hasMany(File, { foreignKey: 'userId' });
File.belongsTo(User);

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User);

File.hasMany(Comment, { foreignKey: 'fileId' });
Comment.belongsTo(File);

User.hasMany(Access, { foreignKey: 'userId' });
Access.belongsTo(User);

File.hasMany(Access, { foreignKey: 'fileId' });
Access.belongsTo(File);
