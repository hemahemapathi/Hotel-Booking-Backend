import express from "express";
import { createRoom, deleteRoom, getRoom, getRooms, updateRoomAvailability, updatedRoom } from "../controllers/room.js";

const router = express.Router();

//create
router.post("/:hotelid",createRoom);

//update
router.put("/:id",updatedRoom);
router.put("/availability/:id",updateRoomAvailability);

//delete
router.delete("/:id/:hotelid",deleteRoom);

//get
router.get("/:id",getRoom);

///get all
router.get("/",getRooms);

export default router;