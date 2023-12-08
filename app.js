import 'dotenv/config';

import session from "express-session";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Hello from './hello.js';
import Lab5 from './Lab5.js';
import CourseRoutes from './courses/routes.js';
import ModuleRoutes from './modules/routes.js';
import AssignmentRoutes from './assignments/routes.js';
import UserRoutes from "./users/routes.js";
const app = express();
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL
    })
);
const sessionOptions = {
    secret: "any string",
    resave: false,
    saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
    };
}

app.use(
    session(sessionOptions)
);

app.use(express.json());


CourseRoutes(app);
ModuleRoutes(app);
UserRoutes(app);
AssignmentRoutes(app);
Lab5(app);
Hello(app);


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true 
});

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');


  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});


process.on('SIGINT', () => {
  db.close(() => {
    console.log('Disconnected from MongoDB');
    process.exit();
  });
});
