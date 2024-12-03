import mongoose from "mongoose";
import dotenv from "dotenv";
//import * as logger from "../services/logger.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
    //logger.logInfo("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    //logger.logError("MongoDB connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
    //logger.logInfo("MongoDB disconnected successfully");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    //logger.logError("MongoDB disconnection error:", error);
    process.exit(1);
  }
};

const dropDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("MongoDB dropped successfully");
    //logger.logInfo("MongoDB dropped successfully");
  } catch (error) {
    console.error("MongoDB drop error:", error);
    //logger.logError("MongoDB drop error:", error);
    process.exit(1);
  }
};

export { disconnectDB, dropDB };

export default connectDB;
