import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import sequelize from './src/db.js';
// import { User, File, Access, Comment } from './src/models/models.js';
import router from './src/routes/index.js';
import errorHandler from './src/middleware/errorHandlingMiddleware.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const PORT = process.env.PORT || 2023;

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
    });
  } catch (e) {
    process.stdout.write(`${e} \n`);
  }
}

start();
