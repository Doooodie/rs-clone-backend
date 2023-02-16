import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './db.js';
// TODO: remove next line if imports are not necessary
// import { user, file, access, comment } from './models/models.js';
import router from './routes/index.js';
import errorHandler from './middleware/errorHandlingMiddleware.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const PORT = 2023;

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
      process.stdout.write(`Server is running. PORT: 2023`);
    });
  } catch (e) {
    process.stdout.write(e);
  }
}

start();
