import express from "express";
import "dotenv/config";

import indexRouter from "./routes/indexRouter.js";
import dbConnection from "./models/dbConnection.js";
import cors from "cors";

import cookieParser from 'cookie-parser'


const app = express();

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", indexRouter);

// Start server only after DB connection
dbConnection().then(() => {
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
});