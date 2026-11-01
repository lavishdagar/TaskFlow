import mongoose from "mongoose";

export default async function dbConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to Atlas");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
}