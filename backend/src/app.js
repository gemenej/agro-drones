import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import bodyParser from 'body-parser';

import droneRouter from './routes/drone.route.js';
import fieldRouter from './routes/field.route.js';
import taskRouter from './routes/task.route.js';
import authRouter from './routes/auth.route.js';
import swaggerDocs from "../swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/drones', droneRouter);
app.use('/api/fields', fieldRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/auth', authRouter);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

swaggerDocs(app, PORT);

