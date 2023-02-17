import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs/promises';
import { constants } from 'fs';
import fileUpload from 'express-fileupload';
import sequelize from './src/db.js';
// import { User, File, Access, Comment } from './src/models/models.js';
import router from './src/routes/index.js';
import errorHandler from './src/middleware/errorHandlingMiddleware.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(dirname, '/public')));
app.use(fileUpload({}));
app.use('/', router);

app.use(errorHandler);

async function start() {
  try {
    app.listen(PORT, async () => {
      await sequelize.authenticate();
      await sequelize.sync();
      process.stdout.write(`Server is running. PORT: ${PORT} \n`);

      // check a folder /PUBLIC existence
      try {
        await fs.access(path.resolve(dirname, 'public'), constants.F_OK);
      } catch (e) {
        process.stdout.write('folder PUBLIC does not exists. creating...');
        await fs.mkdir(path.resolve(dirname, 'public'));
      }
    });
  } catch (e) {
    process.stdout.write(`${e} \n`);
  }
}

start();
