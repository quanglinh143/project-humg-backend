import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
 {
  ID_User: {
   type: String,
   required: true,
  },
  ID_Product: {
   type: String,
   required: true,
  },
  title: {
   type: String,
   required: true,
  },
  rating: {
   type: Number,
   required: true,
  },
  comment: {
   type: String,
   required: true,
  },
  name: {
   type: String,
   required: true,
  },
 },
 {
  timestamps: true,
 }
)

export default mongoose.model("Review", reviewSchema)
