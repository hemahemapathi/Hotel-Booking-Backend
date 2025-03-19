import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  hotelId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure a user can only rate a hotel once
RatingSchema.index({ userId: 1, hotelId: 1 }, { unique: true });

export default mongoose.model("Rating", RatingSchema);
