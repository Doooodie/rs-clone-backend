import { Sequelize } from 'sequelize'

const DB_NAME = "rs-clone";
const DB_USER = "postgres";
const DB_PASSWORD = "user";
const DB_HOST = "localhost";
const DB_PORT = 5432;

export default new Sequelize(
    DB_NAME, 
    DB_USER, 
    DB_PASSWORD,
    {
        dialect: 'postgres',
        host: DB_HOST,
        port: DB_PORT,
    },
);
