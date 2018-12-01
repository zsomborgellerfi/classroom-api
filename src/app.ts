import express from 'express';
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import {config} from "dotenv";

const app = express();
config();
//
import questionRoutes from './routes/questions'
import userRoutes from './routes/users'

mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_ATLAS_PASSWORD}@classroom-api-rc4p2.mongodb.net/test?retryWrites=true`, {
    useNewUrlParser: true,
    useCreateIndex: true
});
// logger middleware
app.use(morgan('dev'));

// Parse the body of any request
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handle CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/questions', questionRoutes);
app.use('/users', userRoutes);

// Handle errors
app.use((req, res, next) => {
    let error: any;
    error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
