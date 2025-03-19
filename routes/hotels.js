import express from "express";
import { countByCity, countByType, createHotel, deleteHotel, getHotel, getHotelRooms, getHotels, updatedHotel } from "../controllers/hotel.js";
const router = express.Router();
//create
router.post("/",createHotel);

//update
router.put("/:id",updatedHotel);

//delete
router.delete("/:id",deleteHotel);

//get
router.get("/find/:id",getHotel);

///get all
router.get("/",getHotels);

router.get("/countByCity",countByCity);
router.get("/countByType",countByType);
router.get("/room/:id",getHotelRooms);
    

export default router;