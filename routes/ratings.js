import express from "express";
import { 
  createRating, 
  updateRating, 
  deleteRating, 
  getHotelRatings,
  getUserRating
} from "../controllers/ratings.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Create a rating (requires authentication)
router.post("/:hotelid", verifyToken, createRating);

// Update a rating (requires authentication)
router.put("/:hotelid", verifyToken, updateRating);

// Delete a rating (requires authentication)
router.delete("/:hotelid", verifyToken, deleteRating);

// Get all ratings for a hotel
router.get("/hotel/:hotelid", getHotelRatings);

// Get user's rating for a hotel (requires authentication)
router.get("/user/:hotelid", verifyToken, getUserRating);

export default router;
