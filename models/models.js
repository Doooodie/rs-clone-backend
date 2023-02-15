import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

export const user = sequelize.define('user', {
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
            type: DataTypes.STRING
        },
    },  {
        timestamps: false,
    }
);

export const file = sequelize.define('file', {
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
    }, }, 
    {
        timestamps: false,
    }
);

export const comment = sequelize.define('comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: DataTypes.STRING,
            unique: false,
        },
    }, {
        timestamps: false,
    }
);

export const access = sequelize.define('access', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    }, {
        timestamps: false,
    }
);

user.hasMany(file, { foreignKey: 'userId' });
file.belongsTo(user);

user.hasMany(comment, { foreignKey: 'userId' });
comment.belongsTo(user);

file.hasMany(comment, { foreignKey: 'fileId' });
comment.belongsTo(file);

user.hasMany(access, { foreignKey: 'userId' });
access.belongsTo(user);

file.hasMany(access, { foreignKey: 'fileId' });
access.belongsTo(file);
