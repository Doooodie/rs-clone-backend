import express from 'express';
import sequelize from './db.js';
import cors from 'cors';
import { user, file, access, comment } from './models/models.js';
import router from './routes/index.js';
import errorHandler from './middleware/errorHandlingMiddleware.js'
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 2023;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '/public')));
app.use(fileUpload({}));
app.use('/', router);

app.use(errorHandler);

async function start() {
    try {
        app.listen(PORT, async () => {
            await sequelize.authenticate();
            await sequelize.sync();
            console.log(`Server is running. PORT: 2023`);
        });
    } catch (e) {
        console.log(e);
    };
}

start();
