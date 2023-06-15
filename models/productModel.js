import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
 {
  name: {
   type: String,
   required: true,
   trim: true,
   unique: true,
  },
  price: {
   type: Number,
   trim: true,
   required: true,
  },
  description: {
   type: String,
   required: true,
  },
  content: {
   type: String,
   required: true,
  },
  images: {
   type: Object,
   required: true,
  },
  category: {
   type: String,
   required: true,
  },
  brand: {
   type: String,
   required: true,
  },
  quantity: {
   type: Number,
   required: true,
  },
  remaining: {
   type: Number,
  },
  ratings: {
   type: Number,
   default: 0,
  },
  checked: {
   type: Boolean,
   default: false,
  },
  sold: {
   type: Number,
   default: 0,
  },
 },
 {
  timestamps: true,
 }
)

export default mongoose.model("Product", productSchema)
