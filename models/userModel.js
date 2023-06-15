import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
 {
  name: {
   type: String,
   required: true,
  },
  email: {
   type: String,
   require: true,
   unique: true,
  },
  password: {
   type: String,
   required: true,
  },
  phone_number: {
   type: String,
  },
  avatar: {
   type: Object,
   default: {},
  },
  date_of_birth: {
   type: Date,
   default: null,
  },
  gender: {
   type: String,
   enum: ["0", "1", "2"],
  },
  address: {
   type: String,
   default: "",
  },
  role: {
   type: Number,
   default: 0,
  },
  cart: {
   type: Array,
   default: [],
  },
  rank: {
   type: String,
   enum: ["đồng", "bạc", "vàng", "bạch kim", "kim cương"],
   default: "đồng",
  },
  discount: {
   type: Number,
   default: 0,
  },
  totalPayment: {
   type: Number,
   default: 0,
  },
 },
 {
  timestamps: true,
 }
)

export default mongoose.model("Users", userSchema)
