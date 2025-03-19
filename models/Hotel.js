import mongoose from "mongoose";
const { Schema } = mongoose;

const HotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance:{
    type:String,
    required:true
  },
  photos:{
    type:Array,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rooms:{
      type: [String]
    },
  cheapestPrice: {
    type: Number,
    required: true,
  },
  featured:{
    type:Boolean,
    default:false,
  },
  ratings: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  numberOfRatings: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("Hotel", HotelSchema);
