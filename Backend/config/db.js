import mongoose from "mongoose";
import config from "../config/config.js";
import createAdmin from "../models/scripts/createAdmin.js";

const databaseConnection = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
    });
    mongoose.connection.on("failed", () => {
      console.log("database connection faild");
    });
    await mongoose.connect(config.mongodb_connection_string);
    await createAdmin()
  } catch (error) {
    console.log("connection failed due to" + error);
    process.exit(1);
  }
};

export default databaseConnection;
