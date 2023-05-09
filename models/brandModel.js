import mongoose from "mongoose"

const brandSchema = new mongoose.Schema(
 {
  name: {
   type: String,
   required: true,
   trim: true,
   unique: true,
  },
 },
 {
  timestamps: true,
 }
)

export default mongoose.model("Brand", brandSchema)
