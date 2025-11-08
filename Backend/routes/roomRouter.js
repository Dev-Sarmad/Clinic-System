import express from "express";
import {getRooms} from "../controllers/roomsController.js";
const roomRouter = express.Router();

roomRouter.get("/", getRooms);

export default roomRouter;
