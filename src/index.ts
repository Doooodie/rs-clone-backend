import path from 'path';
import * as dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs/promises';
import { constants } from 'fs';
import fileUpload from 'express-fileupload';
import sequelize from './db.js';
import router from './routes/index.js';
import errorHandler from './middleware/errorHandlingMiddleware.js';

dotenv.config();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const { PORT, PGHOST } = process.env;

const app = express();
const staticPath = PGHOST === 'localhost' ? '../public' : '../app/public';

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(dirname, staticPath)));
app.use(fileUpload({}));
app.use('/', router);

app.use(errorHandler);

async function start() {
  try {
    app.listen(PORT, async () => {
      await sequelize.authenticate();
      await sequelize.sync();
      process.stdout.write(`Server is running. PORT: ${PORT} \n`);

      try {
        await fs.access(path.resolve(dirname, '..', 'public'), constants.F_OK);
      } catch (e) {
        process.stdout.write('folder PUBLIC does not exists. creating...');
        await fs.mkdir(path.resolve(dirname, '..', 'public'));
      }
    });
  } catch (e) {
    process.stdout.write(`${e} \n`);
  }
}

start();
