import { Sequelize } from 'sequelize';

const DB_NAME = 'railway';
const DB_USER = 'postgres';
const DB_PASSWORD = 'JehueCi1q2uIJWCY5ybd';
const DB_HOST = 'containers-us-west-69.railway.app';
const DB_PORT = 6238;

export default new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
});
