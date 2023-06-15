import Review from "../models/reviewModel.js"
import Product from "../models/productModel.js"
import Payment from "../models/paymentModel.js"
import User from "../models/userModel.js"

const getReviewsProductById = async (req, res) => {
 const { id } = req.params
 const page = parseInt(req.query.page)
 const limit = parseInt(req.query.limit)
 try {
  const getAllItemsByID = await Review.find({
   ID_Product: id,
  })

  const startIndex = (page - 1) * limit
  const lastIndex = page * limit

  const results = {}

  results.totalReviews = getAllItemsByID.length
  results.pageCount = Math.ceil(getAllItemsByID.length / limit)

  if (lastIndex < getAllItemsByID.length) {
   results.next = {
    page: page + 1,
   }
  }

  if (startIndex > 0) {
   results.prev = {
    page: page - 1,
   }
  }
  results.result = getAllItemsByID.slice(startIndex, lastIndex)

  const getDataReviews = await Review.find()
  const reviews = getDataReviews?.filter((item) => {
   return item.ID_Product === id
  })

  let totalValueRating = 0
  for (let i = 0; i < reviews.length; i++) {
   totalValueRating += reviews[i].rating
  }

  ratings(id, (totalValueRating = totalValueRating / reviews.length))
  return res.json(results)
 } catch (error) {
  return res.status(500).json({ msg: "Can't get data result." })
 }
}

const ratings = async (ID_Product, totalValueRating) => {
 await Product.findOneAndUpdate(
  { _id: ID_Product },
  {
   ratings: parseFloat(totalValueRating.toFixed(1)) || 0,
  }
 )
}

const createReviewsProductById = async (req, res) => {
 const { idUser, title, comment, rating } = req.body
 const { id } = req.params
 const payments = await Payment.find()

 try {
  const exists = await Review.findOne({ ID_User: idUser, ID_Product: id })
  if (exists) return res.status(400).json({ msg: "Sản phẩm đã được đánh giá." })
  const bought = payments.find((item) => {
   return item?.cart.find((cart) => {
    return item.user_id === idUser && cart._id === id && item.status === "3"
   })
  })
  if (!bought)
   return res
    .status(400)
    .json({ msg: "Bạn cần mua sản phẩm này để được đánh giá." })
  const getUserReview = await User.findOne({ _id: idUser })
  if (!comment || !rating)
   return res.status(400).json({ msg: "Vui lòng nhập đủ trường dữ liệu." })
  const newReview = new Review({
   ID_User: idUser,
   ID_Product: id,
   title,
   comment,
   rating,
   name: getUserReview.name,
  })
  await newReview.save()
  res.json({ msg: "Đánh giá thành công" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

export default {
 getReviewsProductById,
 createReviewsProductById,
}
