import express from "express";
import "dotenv/config";
import databaseConnection from "./config/db.js";
import authRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/config.js";
import doctorRouter from "./routes/doctorRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import authenticationMiddleware from "./middlewares/authMiddleware.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use(
  "/api/doctors",
  doctorRouter
);
app.use("/api/appointments", authenticationMiddleware,appointmentRouter)

const startServer = async () => {
  await databaseConnection();
  app.listen(config.port, () => {
    console.log(`server is running ${config.port}`);
  });
};

startServer();
