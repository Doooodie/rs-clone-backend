import { Sequelize } from 'sequelize';

const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env;

export default new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
  dialect: 'postgres',
  host: PGHOST,
  port: PGPORT,
});
