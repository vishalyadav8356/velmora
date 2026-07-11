import mongoose from "mongoose";
import {config} from "./config.js";

// Function to connect to the MongoDB database
const connectDB = async ()=>{
    const mongoURI = process.env.MONGO_URI;

    if(!mongoURI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI)
    console.log("MongoDB connected successfully");

}    

export default connectDB;