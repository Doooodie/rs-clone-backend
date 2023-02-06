import express from 'express';
import sequelize from './db.js';

const PORT = 2023;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json('server is running');
});

app.post('/', (req, res) => {
    console.log(req.body);
});

const start = async () => {
    try {
        app.listen(PORT, async () => {
            await sequelize.authenticate();
            await sequelize.sync();
            console.log('SERVER IS RUNNING');
        });
    } catch (e) {
        console.log(e);
    };
}

start();