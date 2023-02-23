import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env;

export default new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
  dialect: 'postgres',
  host: PGHOST,
  port: PGPORT,
});
