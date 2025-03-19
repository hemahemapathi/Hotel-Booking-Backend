import Rating from "../models/Ratings.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

// Create a new rating
export const createRating = async (req, res, next) => {
  const newRating = new Rating({
    userId: req.user.id, // Assuming user ID is available from auth middleware
    hotelId: req.params.hotelid,
    rating: req.body.rating,
    comment: req.body.comment
  });

  try {
    // Check if user has already rated this hotel
    const existingRating = await Rating.findOne({
      userId: req.user.id,
      hotelId: req.params.hotelid
    });

    if (existingRating) {
      return next(createError(400, "You have already rated this hotel"));
    }

    // Save the rating
    const savedRating = await newRating.save();

    // Update hotel's average rating
    await updateHotelRating(req.params.hotelid);

    res.status(201).json(savedRating);
  } catch (err) {
    next(err);
  }
};

// Update an existing rating
export const updateRating = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({
      userId: req.user.id,
      hotelId: req.params.hotelid
    });

    if (!rating) {
      return next(createError(404, "Rating not found"));
    }

    // Update rating
    rating.rating = req.body.rating || rating.rating;
    rating.comment = req.body.comment || rating.comment;
    
    const updatedRating = await rating.save();

    // Update hotel's average rating
    await updateHotelRating(req.params.hotelid);

    res.status(200).json(updatedRating);
  } catch (err) {
    next(err);
  }
};

// Delete a rating
export const deleteRating = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({
      userId: req.user.id,
      hotelId: req.params.hotelid
    });

    if (!rating) {
      return next(createError(404, "Rating not found"));
    }

    await Rating.findByIdAndDelete(rating._id);

    // Update hotel's average rating
    await updateHotelRating(req.params.hotelid);

    res.status(200).json({ message: "Rating has been deleted" });
  } catch (err) {
    next(err);
  }
};

// Get all ratings for a hotel
export const getHotelRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ hotelId: req.params.hotelid });
    res.status(200).json(ratings);
  } catch (err) {
    next(err);
  }
};

// Get a user's rating for a hotel
export const getUserRating = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({
      userId: req.user.id,
      hotelId: req.params.hotelid
    });
    
    if (!rating) {
      return next(createError(404, "Rating not found"));
    }
    
    res.status(200).json(rating);
  } catch (err) {
    next(err);
  }
};

// Helper function to update a hotel's average rating
const updateHotelRating = async (hotelId) => {
  try {
    const ratings = await Rating.find({ hotelId });
    
    if (ratings.length === 0) {
      // If no ratings, set hotel rating to 0
      await Hotel.findByIdAndUpdate(hotelId, { rating: 0 });
      return;
    }
    
    // Calculate average rating
    const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = (totalRating / ratings.length).toFixed(1);
    
    // Update hotel with new average rating
    await Hotel.findByIdAndUpdate(hotelId, { rating: averageRating });
  } catch (err) {
    console.error("Error updating hotel rating:", err);
  }
};
